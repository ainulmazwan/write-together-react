import Header from "../components/Header";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { getStoriesByAuthor } from "../utils/api_stories";
import { getFavouritedStories } from "../utils/api_users";
import { getChaptersByAuthor } from "../utils/api_chapters";
import { useEffect, useState } from "react";
import { DELETED_STORY_ID } from "../utils/constants";
import { toast } from "sonner";
import { addToFavourites, removeFromFavourites } from "../utils/api_users";
import StoriesGrid from "../components/StoriesGrid";
import ModeIcon from "@mui/icons-material/Mode";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(["currentuser"]);
  const [storiesByUser, setStoriesByUser] = useState([]);
  const [chaptersByUser, setChaptersByUser] = useState([]);
  const [favouritedStories, setFavouritedStories] = useState([]); // with story object
  const [favourites, setFavourites] = useState([]); // just the ids
  const { currentuser } = cookies;

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
      return;
    } else if (currentuser.role === "admin") {
      navigate("/");
      return;
    }

    getStoriesByAuthor(currentuser._id, currentuser.token).then((data) => {
      setStoriesByUser(data);
    });

    getChaptersByAuthor(currentuser._id, currentuser.token).then((data) => {
      setChaptersByUser(data);
    });

    getFavouritedStories(currentuser._id, currentuser.token).then((data) => {
      setFavouritedStories(data);
    });

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
      toast.error("Error updating favourites : " + error);
    }
  };

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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {currentuser?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {currentuser?.email}
            </Typography>
          </Box>
          <Box>
            <Button component={Link} to={`/users/${currentuser._id}`}>
              <ModeIcon sx={{ marginRight: 1 }} />
              Edit Account
            </Button>
          </Box>
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ py: 4 }}>
          Your Stories ({storiesByUser.length})
        </Typography>
        {/* map all stories by user */}
        <StoriesGrid
          stories={storiesByUser}
          favourites={favourites}
          currentuser={currentuser}
          handleFavourite={handleFavourite}
          handleOpenModal={handleOpenModal}
        />
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
                key={chapter._id}
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
                    {chapter.story._id !== DELETED_STORY_ID ? (
                      <>
                        <Link to={`/stories/${chapter.story._id}`}>
                          {chapter.story.title}
                        </Link>{" "}
                        by {chapter.story.author.name}
                      </>
                    ) : (
                      <span>{chapter.story.title}</span>
                    )}
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
        {/* map all favourited stories */}
        <StoriesGrid
          stories={favouritedStories}
          favourites={favourites}
          currentuser={currentuser}
          handleFavourite={handleFavourite}
          handleOpenModal={handleOpenModal}
        />
      </Container>
    </>
  );
};

export default ProfilePage;
