import Header from "../components/Header";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { getVote, addVote, removeVote } from "../utils/api_votes";
import { getChapter, deleteChapter } from "../utils/api_chapters";
import { getStoryById } from "../utils/api_stories";
import { useCookies } from "react-cookie";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { toast } from "sonner";

/* if chapter is not official 
  AND if chapterNumber is equal to story.currentRound.chapterNumber
  AND if story.currentRound.deadline is more than today's date
    show vote button
  else
    don't show
*/

const ChapterPage = () => {
  const { id, chapterId } = useParams();

  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [hasVotedThis, setHasVotedThis] = useState(false);
  const [cannotVote, setCannotVote] = useState(false);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const navigate = useNavigate();

  useEffect(() => {
    getChapter(chapterId).then((data) => {
      setChapter(data);
    });
    getStoryById(id).then((data) => {
      setStory(data);
    });

    if (!currentuser) {
      return;
    }
    getVote(currentuser?._id, id, currentuser.token).then((data) => {
      if (!data) {
        setHasVotedThis(false);
      } else if (data.chapter === chapterId) {
        setHasVotedThis(true);
      } else {
        // voted for another submission already
        setCannotVote(true);
      }
    });
  }, [currentuser]);

  if (!chapter || !story) {
    return <>chapter not found</>;
  }

  const handleAddVote = async () => {
    await addVote(currentuser._id, chapterId, id, currentuser.token).then(() =>
      setHasVotedThis(true)
    );
    toast.success("Vote added!");
  };

  const handleRemoveVote = async () => {
    await removeVote(currentuser._id, chapterId, currentuser.token).then(() =>
      setHasVotedThis(false)
    );
    toast.success("Vote retracted!");
  };

  const canVote =
    !chapter.isOfficial && // only unofficial chapters/submissions
    story.currentRound.chapterNumber === chapter.chapterNumber && // same round as story's current round
    new Date(story.currentRound.deadline) > new Date(); // deadline not passed yet

  const handleDeleteModal = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to delete this chapter?",
        html: `
            <p>This action cannot be undone.</p><br />
          `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete chapter",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteChapter(chapterId, currentuser.token);
        toast.success("Chapter deleted successfully");
        navigate(`/profile`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting chapter");
    }
  };

  return (
    <>
      <Header />

      {/* Chapter Info */}
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Chapter {chapter.chapterNumber}
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          by {chapter.author.name}
        </Typography>

        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Original story, {story.title}, by {story.author.name}
          </Typography>
          {currentuser?.role === "admin" ||
          currentuser?._id === chapter.author._id ? (
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ marginRight: 2 }}
                component={Link}
                to={`/stories/${story._id}/chapters/${chapter._id}/update`}
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
        </Box>

        {/* chapter content */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography>{chapter.content}</Typography>
        </Paper>

        {canVote && currentuser?.role !== "admin" ? (
          <>
            {cannotVote ? (
              <Button
                variant="outlined"
                color="secondary"
                disabled
                sx={{ mt: 2 }}
              >
                Vote already in use
              </Button>
            ) : (
              <Button
                variant={hasVotedThis ? "contained" : "outlined"}
                color={hasVotedThis ? "error" : "primary"}
                sx={{ mt: 2 }}
                onClick={() => {
                  if (!currentuser) {
                    return handleOpenModal();
                  }
                  hasVotedThis
                    ? handleRemoveVote(chapterId)
                    : handleAddVote(chapterId);
                }}
              >
                {hasVotedThis ? "Retract" : "Vote"}
              </Button>
            )}
          </>
        ) : null}
      </Container>
    </>
  );
};

export default ChapterPage;
