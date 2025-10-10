import {
  TextField,
  MenuItem,
  Box,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Container,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Link } from "react-router";
import Header from "../components/Header";
import { getStories } from "../utils/api_stories";
import { getGenres } from "../utils/api_genres";
import { addToFavourites, removeFromFavourites } from "../utils/api_users";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import Swal from "sweetalert2";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [favourites, setFavourites] = useState([]);
  const [cookies, setCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies || {};

  // get genres
  useEffect(() => {
    getGenres().then((data) => {
      setGenres(data);
    });
  }, []);

  console.log(genres);

  // fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      const data = await getStories(genre, status, search, sortBy);
      setStories(data);
    };
    fetchStories();
  }, [genre, status, search, sortBy]);

  // set favourites from cookie
  useEffect(() => {
    if (currentuser?.favourites) {
      setFavourites(currentuser.favourites.map((id) => id.toString()));
    } else {
      setFavourites([]);
    }
  }, [currentuser]);

  const handleOpenModal = async () => {
    Swal.fire({
      title: "Login Required",
      text: "You need to be logged in to favourite stories.",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Login",
      denyButtonText: "Sign Up",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) window.location.href = "/login";
      else if (result.isDenied) window.location.href = "/signup";
    });
  };

  const handleFavourite = async (storyId, isFavourited) => {
    try {
      let updatedUser;
      if (isFavourited) {
        updatedUser = await removeFromFavourites(currentuser._id, storyId);
        setFavourites((prev) => prev.filter((id) => id !== storyId));
        toast.success("Removed from favourites");
      } else {
        updatedUser = await addToFavourites(currentuser._id, storyId);
        setFavourites((prev) => [...prev, storyId]);
        toast.success("Added to favourites");
      }
      setCookie("currentuser", updatedUser, { path: "/" });
    } catch (error) {
      toast.error("Error updating favourites");
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3, py: 4 }}>
        {/* filters */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            xs={{ minWidth: "500px" }}
          />
          <Box>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="hiatus">Hiatus</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              size="small"
              sx={{ minWidth: 150, marginLeft: 2 }}
            >
              <MenuItem value="all">All Genres</MenuItem>
              {genres.length !== 0 ? (
                genres.map((genre) => (
                  <MenuItem value={genre._id}>{genre.name}</MenuItem>
                ))
              ) : (
                <>loading</>
              )}
            </TextField>
            <TextField
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              sx={{ minWidth: 150, marginLeft: 2 }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="alphabetical">Alphabetical</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* stories */}

        <Grid container spacing={3}>
          {stories.length === 0 ? (
            <Typography sx={{ mx: "auto", mt: 4 }}>No stories yet</Typography>
          ) : (
            stories.map((story) => {
              const isFavourited = favourites.includes(story._id.toString());
              return (
                <Grid key={story._id} item size={{ xs: 12, md: 6, lg: 4 }}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      boxShadow: 3,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    {currentuser?.role !== "admin" ? (
                      <IconButton
                        onClick={() => {
                          if (!currentuser) handleOpenModal();
                          else handleFavourite(story._id, isFavourited);
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255,255,255,0.8)",
                          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                        }}
                      >
                        {isFavourited ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                    ) : null}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                        {story.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {story.author.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontWeight: "bold",
                          color:
                            story.status === "ongoing"
                              ? "green"
                              : story.status === "hiatus"
                              ? "orange"
                              : "blue",
                        }}
                      >
                        {story.status.toUpperCase()}
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
      </Box>
    </>
  );
};

export default StoriesPage;
