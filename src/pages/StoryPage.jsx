import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Header from "../components/Header";
import {
  getStoryById,
  advanceRound,
  deleteStory,
  endStory,
  resumeStory,
  incrementViews,
} from "../utils/api_stories";
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
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETED_CHAPTER_ID } from "../utils/constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { handleOpenModal } from "../utils/handle_open_modal";

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
  // for all users
  useEffect(() => {
    getStoryById(id).then((data) => setStory(data));
    getSubmissionsForCurrentRound(id).then((data) => setSubmissions(data));
    incrementViews(id);
  }, [id]);

  useEffect(() => {
    // advance round if past deadline
    if (!story?.currentRound?.deadline) {
      return;
    }

    const now = new Date();
    const deadline = new Date(story.currentRound.deadline);

    if (now > deadline) {
      const handleAdvance = async () => {
        try {
          await advanceRound(id);
          const updatedStory = await getStoryById(story._id);
          const updatedSubs = await getSubmissionsForCurrentRound(story._id);
          setStory(updatedStory);
          setSubmissions(updatedSubs);
        } catch (error) {
          console.error(error);
        }
      };
      handleAdvance();
    }

    // check if story is favourited by logged in user
    if (!currentuser) {
      return;
    }

    getUserById(currentuser._id).then((data) => {
      console.log(data.favourites);
      if (data.favourites.includes(id)) {
        setIsFavourited(true);
      }
    });
  }, [story, currentuser]);

  // check if user currently has a submission for story
  useEffect(() => {
    if (!currentuser) {
      return;
    }
    const userId = currentuser._id;
    const alreadySubmitted = submissions.some(
      (submission) => submission.author._id === userId
    );
    setHasSubmitted(alreadySubmitted);
  }, [currentuser, submissions]);

  // get all the votes for current round and keep in object voteCounts
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const counts = {};
        for (const submission of submissions) {
          // for submission in submissions
          const votes = await getVotesForSubmission(submission._id);
          counts[submission._id] = votes.length; // { m1830m20a9df : 2} contoh
        }
        setVoteCounts(counts);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };
    // only run if there are submissions
    if (submissions.length > 0) {
      fetchVotes();
    }
  }, [submissions]);

  // check if logged in user has voted
  useEffect(() => {
    if (!currentuser) {
      return;
    }
    getVote(currentuser._id, id, currentuser.token).then(
      (data) => setUserVote(data) // {user: "", chapter: "", story: ""}
    );
  }, [currentuser, story]);

  const sortedSubmissions = [...submissions].sort(
    (a, b) => (voteCounts[b._id] || 0) - (voteCounts[a._id] || 0) // descending order high-low
  );

  let lastVoteCount = null;
  let lastRank = 0;

  /*
    since submissions are already sorted, submission n will always have either more/the same number of votes than submission n+1
    if submission share the same no. of votes with the previous, lastRank will not change (they will share the same rank)
    if submission has different number than the last (less votes), lastRank will be index+1 (since index will always increment)
  */

  const rankedSubmissions = sortedSubmissions.map((sub, index) => {
    const votes = voteCounts[sub._id] || 0;
    if (votes !== lastVoteCount) {
      lastRank = index + 1;
      lastVoteCount = votes;
    }
    return { ...sub, rank: lastRank, votes };
  });

  const handleAddVote = async (chapterId) => {
    const userId = currentuser._id;
    const storyId = id;
    await addVote(userId, chapterId, storyId, currentuser.token).then((data) =>
      setUserVote(data)
    );
    setVoteCounts((prev) => ({
      ...prev,
      [chapterId]: (prev[chapterId] || 0) + 1,
    }));
    toast.success("Vote added!");
  };

  const handleRemoveVote = async (chapterId) => {
    const userId = currentuser._id;
    await removeVote(userId, chapterId, currentuser.token);
    setUserVote(null);
    setVoteCounts((prev) => ({
      ...prev,
      [chapterId]: (prev[chapterId] || 0) - 1,
    }));
    toast.success("Vote removed!");
  };

  const handleAddToFavourites = async () => {
    await addToFavourites(currentuser._id, id, currentuser.token);
    setIsFavourited(true);
    setCookie(
      "currentuser",
      {
        ...currentuser,
        favourites: [...(currentuser.favourites || []), id],
      },
      { path: "/" } // to avoid creating in /stories
    );
    toast.success(`${story.title} added to favourites`);
  };

  const handleRemoveFromFavourites = async () => {
    await removeFromFavourites(currentuser._id, id, currentuser.token);
    setIsFavourited(false);
    setCookie(
      "currentuser",
      {
        ...currentuser,
        favourites: (currentuser.favourites || []).filter((fav) => fav !== id),
      },
      { path: "/" }
    );
    toast.success(`${story.title} removed from favourites`);
  };

  const handleDeleteModal = async () => {
    try {
      // get amount of chapters for the story
      const chapterCount = story.chapters.length;
      const submissionCount = story.currentRound.submissions.length;

      const result = await Swal.fire({
        title: "Are you sure you want to delete this story?",
        html: `
          <p>This story has <b>${chapterCount}</b> chapters and <b>${submissionCount}</b> submissions.</p><br />
          <p>Deleting this story will remove it forever(!), but chapters and submissions will still be visible.</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete story",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteStory(id, currentuser.token);
        toast.success("Story deleted successfully");
        if (isAuthor) {
          navigate("/profile");
        } else {
          navigate("/stories");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting story");
    }
  };

  const handleEndStoryModal = async () => {
    try {
      const submissionCount = story.currentRound.submissions.length;

      const result = await Swal.fire({
        title: "Are you sure you want to end this story?",
        html: `
          <p>This story currently has <b>${submissionCount}</b> submissions.</p><br />
          <p>This action cannot be undone!</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, end story",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await endStory(id, currentuser.token);
        const updatedStory = await getStoryById(id);
        setStory(updatedStory);
        toast.success("Story ended successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleResumeStoryModal = async () => {
    try {
      const deadline = new Date(story.currentRound.deadline);
      const result = await Swal.fire({
        title: "Are you sure you want to resume this story?",
        html: `
          <p>The next round will end <b>${formatDistanceToNow(
            deadline
          )} from now</b>.</p><br />
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, resume story",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await resumeStory(id, currentuser.token);
        const updatedStory = await getStoryById(id);
        setStory(updatedStory);
        toast.success("Story resumed successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (!story || !voteCounts || !story.chapters) return <>loading</>;

  const isHiatus = story.status === "hiatus";
  const isAuthor = currentuser && currentuser._id === story.author._id;

  return (
    <>
      <Header />
      {/* header */}
      <Box sx={{ maxWidth: 800, mx: "auto", py: 6, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          {story.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Original Author:{" "}
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {story.author.name}
          </Typography>{" "}
          , Genre:{" "}
          <Typography
            component="span"
            variant="h6"
            sx={{ fontStyle: "italic", color: "text.primary" }}
          >
            {story.genre.name}
          </Typography>
        </Typography>
        {currentuser?.role === "admin" ||
        currentuser?._id === story.author._id ? (
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginRight: 2 }}
              component={Link}
              to={`/stories/update/${story._id}`}
            >
              Edit <ModeIcon sx={{ marginLeft: 1 }} />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteModal();
              }}
            >
              Delete <DeleteIcon sx={{ fontSize: "1.2rem", marginLeft: 1 }} />
            </Button>
          </Box>
        ) : null}

        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", mx: 2 }}
          >
            <VisibilityIcon sx={{ fontSize: "1rem", marginRight: 1 }} />{" "}
            {story.views} views
          </Typography>
          {currentuser?.role !== "admin" ? (
            <Button
              onClick={() =>
                currentuser
                  ? isFavourited
                    ? handleRemoveFromFavourites()
                    : handleAddToFavourites()
                  : handleOpenModal({
                      text: "You need to be logged in to favourite stories.",
                    })
              }
            >
              {isFavourited ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </Button>
          ) : null}
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ pb: 6 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Description
          </Typography>
          <Typography>{story.description}</Typography>
        </Paper>

        {/* chapters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Chapters
          </Typography>
          {story.chapters.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {story.chapters.map((chapter, index) => (
                <Button
                  key={chapter._id}
                  component={Link}
                  to={`chapters/${chapter._id}`}
                  disabled={chapter._id === DELETED_CHAPTER_ID}
                  color="black"
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    Chapter {index + 1}
                  </Typography>
                  <Typography color="text.secondary" fontSize="0.9rem">
                    {chapter._id === DELETED_CHAPTER_ID
                      ? "[Deleted Chapter]"
                      : `by ${chapter.author?.name || "Unknown Author"}`}
                  </Typography>
                </Button>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No chapters yet.</Typography>
          )}
        </Paper>

        {/* current round */}
        <Paper elevation={2} sx={{ p: 3 }}>
          {story?.status !== "completed" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h5">
                  Current Round: Chapter {story.currentRound.chapterNumber}
                </Typography>
                {isHiatus ? (
                  <Typography variant="h6" color="error">
                    On Hiatus
                  </Typography>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Votes close in{" "}
                    <Typography
                      color="black"
                      component="span"
                      sx={{ fontWeight: "bold" }}
                    >
                      {formatDistanceToNow(
                        new Date(story.currentRound.deadline)
                      )}
                    </Typography>
                  </Typography>
                )}
              </Box>

              {isHiatus ? (
                <>
                  <Typography color="text.secondary">
                    This story is currently on hiatus. New submissions and votes
                    are paused.
                  </Typography>
                  {isAuthor || currentuser?.role === "admin" ? (
                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleResumeStoryModal}
                      >
                        Resume Story
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleEndStoryModal}
                      >
                        End Story
                      </Button>
                    </Box>
                  ) : null}
                </>
              ) : (
                <>
                  {/* submissions */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    {submissions.length ? (
                      rankedSubmissions.map((submission) => {
                        const hasVotedThis =
                          userVote?.chapter === submission._id;
                        const voteDisabled = userVote && !hasVotedThis;
                        return (
                          <Paper
                            key={submission._id}
                            elevation={1}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              px: 2,
                              py: 1.5,
                              borderRadius: 2,
                            }}
                          >
                            <Button
                              component={Link}
                              to={`chapters/${submission._id}`}
                              color="black"
                              sx={{
                                textTransform: "none",
                                flexGrow: 1,
                                textAlign: "left",
                              }}
                            >
                              <Typography sx={{ fontWeight: "bold" }}>
                                Submission by {submission.author.name}
                              </Typography>
                            </Button>

                            <Typography sx={{ mx: 2 }}>
                              #{submission.rank} — {submission.votes} votes
                            </Typography>

                            {currentuser?.role !== "admin" ? (
                              <Button
                                variant={
                                  hasVotedThis ? "contained" : "outlined"
                                }
                                color={hasVotedThis ? "error" : "primary"}
                                disabled={voteDisabled}
                                onClick={() => {
                                  if (!currentuser) {
                                    return handleOpenModal({
                                      text: "You need to be logged in to vote.",
                                    });
                                  }
                                  hasVotedThis
                                    ? handleRemoveVote(submission._id)
                                    : handleAddVote(submission._id);
                                }}
                              >
                                {hasVotedThis ? "Retract" : "Vote"}
                              </Button>
                            ) : null}
                          </Paper>
                        );
                      })
                    ) : (
                      <Typography color="text.secondary">
                        No submissions yet.
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {currentuser?.role !== "admin" ? (
                      <Button
                        disabled={hasSubmitted}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (!currentuser) {
                            return handleOpenModal({
                              text: "You need to be logged in to enter a submission.",
                            });
                          }
                          navigate(`/stories/${story._id}/submit`);
                        }}
                      >
                        {hasSubmitted
                          ? "You already have a submission for this round!"
                          : "Submit a Chapter"}
                      </Button>
                    ) : null}
                    {story?.status === "ongoing" &&
                    (isAuthor || currentuser?.role === "admin") ? (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleEndStoryModal}
                      >
                        End Story
                      </Button>
                    ) : null}
                  </Box>
                </>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h5" color="success" sx={{ fontWeight: 700 }}>
                This story is completed.
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                You can still view all chapters and submissions, but no new
                content or votes can be added.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default StoryPage;
