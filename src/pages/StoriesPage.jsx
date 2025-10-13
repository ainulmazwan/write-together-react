import { TextField, MenuItem, Box } from "@mui/material";
import Header from "../components/Header";
import { getStories } from "../utils/api_stories";
import { getGenres } from "../utils/api_genres";
import { addToFavourites, removeFromFavourites } from "../utils/api_users";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import StoriesGrid from "../components/StoriesGrid";
import { handleOpenModal } from "../utils/handle_open_modal";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [favourites, setFavourites] = useState([]);
  const [cookies, setCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  // get genres
  useEffect(() => {
    getGenres().then((data) => {
      setGenres(data);
    });
  }, []);

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

  const handleFavourite = async (storyId, isFavourited) => {
    try {
      let updatedUser;
      if (isFavourited) {
        updatedUser = await removeFromFavourites(
          currentuser._id,
          storyId,
          currentuser.token
        );
        setFavourites((prev) => prev.filter((id) => id !== storyId));
        toast.success("Removed from favourites");
      } else {
        updatedUser = await addToFavourites(
          currentuser._id,
          storyId,
          currentuser.token
        );
        setFavourites((prev) => [...prev, storyId]);
        toast.success("Added to favourites");
      }
      setCookie(
        "currentuser",
        { ...updatedUser, token: currentuser.token }, // because add/remove from favourites doesnt return a token
        { path: "/" }
      );
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
            flexDirection: { sx: "column", md: "row" },
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
                <MenuItem value="nogenres">No Genres</MenuItem>
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
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="alphabetical">Alphabetical</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* stories */}

        <StoriesGrid
          stories={stories}
          favourites={favourites}
          currentuser={currentuser}
          handleFavourite={handleFavourite}
          handleOpenModal={() => {
            handleOpenModal({
              text: "You need to be logged in to favourite stories",
            });
          }}
        />
      </Box>
    </>
  );
};

export default StoriesPage;
