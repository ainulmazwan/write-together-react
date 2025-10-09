import Header from "../components/Header";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Link, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { getStoriesByAuthor } from "../utils/api_stories";
import { getFavouritedStories } from "../utils/api_users";
import { getChaptersByAuthor } from "../utils/api_chapters";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [cookies] = useCookies(["currentuser"]);
  const [storiesByUser, setStoriesByUser] = useState([]);
  const [chaptersByUser, setChaptersByUser] = useState([]);
  const [favouritedStories, setFavouritedStories] = useState([]);
  const { currentuser } = cookies;

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
      return;
    }

    getStoriesByAuthor(currentuser._id).then((data) => {
      setStoriesByUser(data);
    });

    getChaptersByAuthor(currentuser._id).then((data) => {
      setChaptersByUser(data);
    });

    getFavouritedStories(currentuser._id).then((data) => {
      setFavouritedStories(data);
    });
  }, [currentuser]);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ py: 4 }}>
          Your Stories
        </Typography>
        {/* map all stories by user */}
        <Grid container spacing={3} sx={{ mx: "auto" }}>
          {storiesByUser.length === 0 ? (
            <>no stories yet</>
          ) : (
            storiesByUser.map((story) => {
              const isPublished = new Date(story.publishDate) <= new Date();

              return (
                <Grid key={story._id} item xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1200px-Cat_August_2010-4.jpg"
                      alt="Story Image"
                    />
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          {story.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            px: 1,
                            py: 0.3,
                            borderRadius: "8px",
                            fontWeight: 500,
                            color: isPublished ? "green" : "orange",
                            backgroundColor: isPublished
                              ? "#e6f4ea"
                              : "#fff3e0",
                          }}
                        >
                          {isPublished ? "Published" : "Unpublished"}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {story.author.name}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        component={Link}
                        to={`/stories/${story._id}`}
                      >
                        View Story
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Container>
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ my: 4 }}>
          Your Chapters
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
          {chaptersByUser.length === 0 ? (
            <>no chapters yet</>
          ) : (
            chaptersByUser.map((chapter) => (
              <Button
                component={Link}
                to={`/stories/${chapter.story._id}/chapters/${chapter._id}`}
                variant="none"
                sx={{
                  p: "6px 0px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography>
                    Chapter {chapter.chapterNumber} | {chapter.story.title} (by{" "}
                    {chapter.author.name})
                  </Typography>
                </Box>
                <Typography>
                  {chapter.isOfficial ? "Official" : "Unofficial"}
                </Typography>
              </Button>
            ))
          )}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ py: 4 }}>
          Your Favourites
        </Typography>
        <Grid container spacing={3} sx={{ mx: "auto" }}>
          {/* map all favourited stories */}
          {/* placeholder for now */}
          {favouritedStories.map((story) => (
            <Grid key={story._id} item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1200px-Cat_August_2010-4.jpg"
                  alt="Story Image"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {story.author?.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/stories/${story._id}`}
                  >
                    View Story
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default ProfilePage;
