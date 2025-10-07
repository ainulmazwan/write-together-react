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
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [cookies] = useCookies(["currentuser"]);
  const [storiesByUser, setStoriesByUser] = useState([]);
  const { currentuser } = cookies;

  // console.log(currentuser ? currentuser : "no current user");

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
      return;
    }

    getStoriesByAuthor(currentuser._id).then((data) => {
      setStoriesByUser(data);
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
            storiesByUser.map((story) => (
              <Grid key={story._id} sx={{ size: { xs: 12, sm: 6, md: 4 } }}>
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
            ))
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
          <Button
            variant="none"
            sx={{
              p: "6px 0px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography>Chapter 3 | Story 1 (by User 1)</Typography>
            </Box>
            <Typography>Official</Typography>
          </Button>
          <Button
            variant="none"
            sx={{
              p: "6px 0px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography>Chapter 2 | Story 3 (by User 2)</Typography>
            </Box>
            <Typography>Unofficial</Typography>
          </Button>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ py: 4 }}>
          Your Favourites
        </Typography>
        <Grid container spacing={3} sx={{ mx: "auto" }}>
          {/* map all favourited stories */}
          {/* placeholder for now */}
          {storiesByUser.map((story) => (
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
                    to="/stories/1"
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
