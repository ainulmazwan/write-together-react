import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Header from "../components/Header";
import { getStoryById } from "../utils/api_stories";
import { getSubmissionsForCurrentRound } from "../utils/api_chapters";
import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

const StoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const [story, setStory] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    getStoryById(id).then((data) => {
      setStory(data);
    });
    getSubmissionsForCurrentRound(id).then((data) => {
      setSubmissions(data);
    });
  }, [id, navigate]);

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

  const handleOpenModal = async () => {
    Swal.fire({
      title: "Login Required",
      text: "You need to be logged in to create a submission.",
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
  if (!story) {
    return <>loading</>;
  }

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
              submissions.map((submission, i) => (
                <Button
                  variant="none"
                  component={Link}
                  to={`chapters/${submission._id}`}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography>
                      Submission {i + 1}: by {submission.author.name}
                    </Typography>
                    {/* placeholder for now */}
                    <Typography>#1 : 27 votes</Typography>
                  </Box>
                </Button>
              ))
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
