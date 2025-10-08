import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Header from "../components/Header";
import { getStoryById } from "../utils/api_stories";
import {
  getVotesForSubmission,
  addVote,
  removeVote,
  getVote,
} from "../utils/api_votes";
import { getSubmissionsForCurrentRound } from "../utils/api_chapters";
import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { toast } from "sonner";

const StoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const [story, setStory] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [voteCounts, setVoteCounts] = useState({});
  const [userVote, setUserVote] = useState(null);

  // get submissions for current round
  useEffect(() => {
    getStoryById(id).then((data) => {
      setStory(data);
    });
    getSubmissionsForCurrentRound(id).then((data) => {
      setSubmissions(data);
    });
  }, [id, navigate]);

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
      lastRank = index + 1;
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

  console.log(voteCounts);

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
            <Typography variant="h5">
              Votes counted in{" "}
              {formatDistanceToNow(new Date(story.currentRound.deadline))}
            </Typography>
          </Box>

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
                const hasVotedThis = userVote?.chapter === submission._id; // if user voted this submission
                const voteDisabled = userVote && !hasVotedThis; // disable vote button if user did not vote this, but voted something else
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
              // check if user is logged in
              if (!currentuser) {
                handleOpenModal(); // show login/signup modal
              } else {
                navigate(`/stories/${story._id}/submit`); // go to submission page
              }
            }}
          >
            {hasSubmitted
              ? "You already have a submission for this round!"
              : "Submit a Chapter"}
          </Button>
        </Container>
      </Paper>
    </>
  );
};

export default StoryPage;
