import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Link } from "react-router-dom";

const StoriesGrid = ({
  // extract all props
  stories = [],
  favourites = [],
  currentuser = null,
  handleFavourite = () => {},
  handleOpenModal = () => {}, // backup values
}) => {
  return (
    <Grid container spacing={3}>
      {stories.length === 0 ? (
        <Typography sx={{ mx: "auto", mt: 4 }}>No stories yet</Typography>
      ) : (
        stories.map((story) => {
          const isFavourited = favourites.includes(story._id.toString());
          return (
            <Grid key={story._id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: 3,
                }}
              >
                {/* admins cannot favourite */}
                {currentuser?.role !== "admin" && (
                  <IconButton
                    onClick={() => {
                      if (!currentuser) {
                        handleOpenModal();
                      } else {
                        handleFavourite(story._id, isFavourited);
                      }
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {isFavourited ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {story.author?.name || "Unknown"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
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
                      {story.status?.toUpperCase()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <VisibilityIcon
                        sx={{ fontSize: "1rem", marginRight: 1 }}
                      />{" "}
                      {story.views} views
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Genre: {story.genre?.name || "Unknown"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Created At:{" "}
                      {/* en-MY malaysia time, english month */}
                      {new Date(story.createdAt).toLocaleDateString("en-MY", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || "Unknown"}
                    </Typography>
                  </Box>
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
  );
};

export default StoriesGrid;
