import React from "react";
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

const StoriesPage = () => {
  // Dummy array to map cards
  const items = Array(9).fill({ title: "Story Title", author: "Author Name" });

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
        {/* Top bar with search and dropdowns */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          {/* Search field on left */}
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
              defaultValue="all"
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">All Genres</MenuItem>
              <MenuItem value="fantasy">Fantasy</MenuItem>
              <MenuItem value="sci-fi">Sci-Fi</MenuItem>
              <MenuItem value="mystery">Mystery</MenuItem>
            </TextField>

            <TextField
              id="sort-stories"
              select
              label="Sort By"
              defaultValue="newest"
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* 3-column grid for cards */}
        <Grid container spacing={3} sx={{ mx: "auto" }}>
          {items.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1200px-Cat_August_2010-4.jpg"
                  alt="Story Image"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.author}
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
      </Box>
    </>
  );
};

export default StoriesPage;
