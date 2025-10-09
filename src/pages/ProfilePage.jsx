import Header from "../components/Header";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
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

  console.log(currentuser);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: "12px",
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {currentuser?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {currentuser?.email}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Member since{" "}
            {currentuser?.createdAt
              ? format(new Date(currentuser.createdAt), "MMMM yyyy")
              : "Unknown"}
          </Typography>
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ py: 4 }}>
          Your Stories ({storiesByUser.length})
        </Typography>
        {/* map all stories by user */}
        <Grid container spacing={3} sx={{ mx: "auto" }}>
          {storiesByUser.length === 0 ? (
            <>no stories yet</>
          ) : (
            storiesByUser.map((story) => {
              const isPublished = new Date(story.publishDate) <= new Date();

              return (
                <Grid key={story._id} item size={{ xs: 12, md: 6, lg: 4 }}>
                  <Card>
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
          Your Chapters ({chaptersByUser.length})
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
                    Chapter {chapter.chapterNumber} |{" "}
                    <Link to={`/stories/${chapter.story._id}`}>
                      {chapter.story.title}
                    </Link>{" "}
                    (by {chapter.story.author.name})
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
          Your Favourites ({favouritedStories.length})
        </Typography>
        <Grid container spacing={3} sx={{ mx: "auto" }}>
          {/* map all favourited stories */}
          {favouritedStories.map((story) => (
            <Grid key={story._id} item size={{ xs: 12, md: 6, lg: 4 }}>
              <Card>
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
