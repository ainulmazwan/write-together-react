import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Header from "../components/Header";
import { getStoryById } from "../utils/api_stories";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";

const StoryPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [story, setStory] = useState(null);

  useEffect(() => {
    getStoryById(id).then((data) => {
      setStory(data);
    });
  }, [id, navigate]);

  console.log(story);

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
            {story.chapters.map((chapter, index) => (
              <Button variant="none">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography>Chapter {index + 1}</Typography>
                  <Typography>by {chapter.author.name}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Container>
        <Container>
          <Typography variant="h5" sx={{ my: 2 }}>
            Current Round: Chapter {story.chapters.length + 1}
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
            <Button variant="none">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>Submission 1: by User</Typography>
                <Typography>#1 : 27 votes</Typography>
              </Box>
            </Button>
            <Button variant="none">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>Submission 1: by User</Typography>
                <Typography>#1 : 27 votes</Typography>
              </Box>
            </Button>
            <Button variant="none">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>Submission 1: by User</Typography>
                <Typography>#1 : 27 votes</Typography>
              </Box>
            </Button>
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default StoryPage;
