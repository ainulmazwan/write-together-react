import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Header from "../components/Header";
import { getStoryById, advanceRound } from "../utils/api_stories";
import {
  getVotesForSubmission,
  addVote,
  removeVote,
  getVote,
} from "../utils/api_votes";
import { getUserById } from "../utils/api_users";
import { getSubmissionsForCurrentRound } from "../utils/api_chapters";
import { addToFavourites, removeFromFavourites } from "../utils/api_users";
import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { toast } from "sonner";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const StoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const [story, setStory] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [voteCounts, setVoteCounts] = useState({});
  const [userVote, setUserVote] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);

  // get story data and submissions for current round
  useEffect(() => {
    getStoryById(id).then((data) => {
      setStory(data);
    });

    getSubmissionsForCurrentRound(id).then((data) => {
      setSubmissions(data);
    });
  }, [id, navigate]);

  useEffect(() => {
    // check if story is not loaded
    if (!story?.currentRound?.deadline) return;

    const now = new Date();
    const deadline = new Date(story.currentRound.deadline);

    // if deadline is past, advance round
    if (now > deadline) {
      const handleAdvance = async () => {
        try {
          await advanceRound(id);
          // fetch updated data
          const updatedStory = await getStoryById(story._id);
          const updatedSubs = await getSubmissionsForCurrentRound(story._id);
          // set updated data to states
          setStory(updatedStory);
          setSubmissions(updatedSubs);
        } catch (error) {
          console.error(error);
        }
      };

      handleAdvance();
    }

    if (!currentuser) {
      return;
    }

    // for sm reason cookie does not update, have to call api to get updated user with favourites
    getUserById(currentuser._id).then((data) => {
      if (data.favourites.includes(id)) {
        setIsFavourited(true);
      }
    });
  }, [story, currentuser]); // runs when story is loaded

  // check if user already submitted
  useEffect(() => {
    if (!currentuser) {
      return;
    }
    const userId = currentuser._id;
    // check if user has already submitted a chapter
    const alreadySubmitted = submissions.some(
      (submission) => submission.author._id === userId
    );
    setHasSubmitted(alreadySubmitted);
  }, [currentuser, submissions]);

  // create voteCounts objects to connect vote counts to submissions
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const counts = {};

        for (const submission of submissions) {
          console.log(submission._id);
          const votes = await getVotesForSubmission(submission._id);
          counts[submission._id] = votes.length;
        }

        setVoteCounts(counts);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    if (submissions.length > 0) {
      fetchVotes();
    }
  }, [submissions]);

  // get user vote if there
  useEffect(() => {
    if (!currentuser) {
      return;
    }

    getVote(currentuser._id, id).then((data) => {
      setUserVote(data);
    });
  }, [currentuser, story]);

  const handleOpenModal = async () => {
    Swal.fire({
      title: "Login Required",
      text: "You need to be logged in to access this feature",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Login",
      denyButtonText: "Sign Up",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      } else if (result.isDenied) {
        window.location.href = "/signup";
      }
    });
  };

  // because get story by id is asynchronous
  if (!story || !voteCounts) {
    return <>loading</>;
  }

  // sort submissions for ranking
  const sortedSubmissions = [...submissions].sort((a, b) => {
    const votesA = voteCounts[a._id];
    const votesB = voteCounts[b._id];

    // descending order (high to low)
    return votesB - votesA;
  });

  // assign ranks
  let lastVoteCount = null; // last submission's vote count
  let lastRank = 0; // last submission's rank

  const rankedSubmissions = sortedSubmissions.map((sub, index) => {
    const votes = voteCounts[sub._id] || 0;
    /* since sortedSubmissions is already sorted from high to low votes,
        if the 2nd submission's votes different than the 1st submission's votes,
          it means 2nd has lower rank (ranknumber + 1)
        else 
          2nd submission shares rank with 1st submission
    */
    if (votes !== lastVoteCount) {
      // if previous ranks "share" a rank, make sure that next rank is still logic
      // (ie. 1, 1, 3 -> first 2 share rank 1, third item is still 3rd place)
      lastRank = index + 1; // only add to index if this sub doesnt share rank with previous sub
      lastVoteCount = votes;
    }
    return { ...sub, rank: lastRank, votes };
  });

  const handleAddVote = async (chapterId) => {
    const userId = currentuser._id;
    const storyId = id;
    await addVote(userId, chapterId, storyId).then((data) => {
      // set userVote state
      setUserVote(data);
    });
    // update voteCounts state
    setVoteCounts((prev) => ({
      ...prev,
      [chapterId]: (prev[chapterId] || 0) + 1, // = previous votes for chapter + 1
    }));

    toast.success("Vote added!");
    return;
  };

  const handleRemoveVote = async (chapterId) => {
    const userId = currentuser._id;
    await removeVote(userId, chapterId);
    // remove userVote from state
    setUserVote(null);
    // update voteCounts state
    setVoteCounts((prev) => ({
      ...prev,
      [chapterId]: (prev[chapterId] || 0) - 1, // = previous votes for chapter - 1
    }));
    toast.success("Vote removed!");
    return;
  };

  const handleAddToFavourites = async () => {
    await addToFavourites(currentuser._id, id);

    // update local state
    setIsFavourited(true);

    // update the cookie
    const updatedUser = {
      ...currentuser,
      favourites: [...(currentuser.favourites || []), id],
    };
    setCookie("currentuser", updatedUser);

    toast.success(`${story.title} added to favourites`);
  };

  const handleRemoveFromFavourites = async () => {
    await removeFromFavourites(currentuser._id, id);

    setIsFavourited(false);

    const updatedUser = {
      ...currentuser,
      favourites: (currentuser.favourites || []).filter((fav) => fav !== id),
    };
    setCookie("currentuser", updatedUser);

    toast.success(`${story.title} removed from favourites`);
  };

  const isHiatus = story.status === "hiatus";
  const isAuthor = currentuser && currentuser._id === story.author._id;

  return (
    <>
      <Header />
      {/* Header */}
      <Box sx={{ maxWidth: 800, margin: "0 auto", py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          {story.title}
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          by {story.author.name} | Genre:{story.genre.name}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          {isFavourited ? (
            <Button onClick={handleRemoveFromFavourites}>
              <FavoriteIcon />
            </Button>
          ) : (
            <Button
              onClick={() => {
                currentuser ? handleAddToFavourites() : handleOpenModal();
              }}
            >
              <FavoriteBorderIcon />
            </Button>
          )}
        </Box>
      </Box>

      {/* Main two-column layout */}
      <Paper maxWidth="md" sx={{ mx: 2, p: 5 }}>
        <Container>
          <Typography variant="h5" sx={{ my: 2 }}>
            Description
          </Typography>
          <Typography>{story.description}</Typography>
        </Container>
        <Container>
          <Typography variant="h5" sx={{ my: 3 }}>
            Chapter List
          </Typography>
          <Box
            sx={{
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 2,
            }}
          >
            {story.chapters.map((chapter) => (
              <Button
                variant="none"
                component={Link}
                to={`chapters/${chapter._id}`}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography>Chapter {chapter.chapterNumber}</Typography>
                  <Typography>by {chapter.author.name}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Container>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ my: 2 }}>
              Current Round: Chapter {story.currentRound.chapterNumber}
            </Typography>
            {isHiatus ? (
              <Typography variant="h5" color="error">
                On Hiatus
              </Typography>
            ) : (
              <Typography variant="h5">
                Votes counted in{" "}
                {formatDistanceToNow(new Date(story.currentRound.deadline))}
              </Typography>
            )}
          </Box>

          {isHiatus ? (
            <>
              {/* If it's hiatus, hide voting/submission section */}
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                This story is currently on hiatus. New submissions and votes are
                paused.
              </Typography>

              {/* Author-only controls */}
              {isAuthor && (
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleContinueStory(story._id)}
                  >
                    Resume Story
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleEndStory(story._id)}
                  >
                    End Story
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <>
              {/* Normal round voting/submissions UI (your existing code) */}
              <Box
                sx={{
                  textAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: 2,
                }}
              >
                {submissions.length !== 0 ? (
                  rankedSubmissions.map((submission) => {
                    const hasVotedThis = userVote?.chapter === submission._id;
                    const voteDisabled = userVote && !hasVotedThis;

                    return (
                      <Box
                        key={submission._id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Button
                          variant="none"
                          component={Link}
                          to={`chapters/${submission._id}`}
                          sx={{ flexGrow: 1, justifyContent: "flex-start" }}
                        >
                          <Typography>
                            Submission by {submission.author.name}
                          </Typography>
                        </Button>

                        <Typography>
                          #{submission.rank} — {submission.votes} votes
                        </Typography>

                        <Button
                          variant="outlined"
                          disabled={voteDisabled}
                          onClick={() => {
                            if (!currentuser) return handleOpenModal();

                            if (hasVotedThis) {
                              handleRemoveVote(submission._id);
                            } else {
                              handleAddVote(submission._id);
                            }
                          }}
                        >
                          {hasVotedThis ? "Retract Vote" : "Vote"}
                        </Button>
                      </Box>
                    );
                  })
                ) : (
                  <>no submissions yet</>
                )}
              </Box>

              <Button
                disabled={hasSubmitted}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!currentuser) {
                    handleOpenModal();
                  } else {
                    navigate(`/stories/${story._id}/submit`);
                  }
                }}
              >
                {hasSubmitted
                  ? "You already have a submission for this round!"
                  : "Submit a Chapter"}
              </Button>
            </>
          )}
        </Container>
      </Paper>
    </>
  );
};

export default StoryPage;
