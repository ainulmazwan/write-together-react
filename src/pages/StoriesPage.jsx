import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import Header from "../components/Header";
import { getStories } from "../utils/api_stories";
import { useState, useEffect } from "react";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // set story on load / everytime genre/sortBy changes
  useEffect(() => {
    getStories(genre, sortBy).then((data) => {
      setStories(data);
    });
  }, [genre, sortBy]);

  console.log(genre + " " + sortBy);

  return (
    <>
      <Header />
      {/* placeholder page */}
      <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
        {/* search & filter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            id="search-stories"
            label="Search"
            variant="outlined"
            size="small"
            sx={{ flexBasis: "40%" }}
          />

          {/* Filter and Sort selects on right */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexBasis: "55%",
              justifyContent: "flex-end",
            }}
          >
            <TextField
              id="filter-stories"
              select
              label="Filter"
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
              }}
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">All Genres</MenuItem>
              <MenuItem value="68e3cce7b2b124f59fa04578">Fantasy</MenuItem>
            </TextField>

            <TextField
              id="sort-stories"
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="alphabetical">Alphabetical</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* 3-column grid for cards */}
        <Grid container spacing={3} sx={{ mx: "auto" }}>
          {stories.length === 0 ? (
            <>no stories yet</>
          ) : (
            stories.map((story) => (
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
      </Box>
    </>
  );
};

export default StoriesPage;
