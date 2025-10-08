import Header from "../components/Header";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getChapter } from "../utils/api_chapters";
import { getStoryById } from "../utils/api_stories";

/* if chapter is not official 
  AND if chapterNumber is equal to story.currentRound.chapterNumber
  AND if story.currentRound.deadline is more than today's date
    show vote button
  else
    don't show
*/

const ChapterPage = () => {
  const { id, chapterId } = useParams();
  console.log(id + " " + chapterId);

  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    getChapter(chapterId).then((data) => {
      setChapter(data);
    });
    getStoryById(id).then((data) => {
      setStory(data);
    });
  }, []);

  if (!chapter || !story) {
    return <>chapter not found</>;
  }

  const handleVote = () => {};

  return (
    <>
      <Header />

      {/* Chapter Info */}
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Chapter {chapter.chapterNumber}
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          by {chapter.author.name}
        </Typography>

        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Original story, {story.title}, by {story.author.name}
          </Typography>
        </Box>

        {/* Chapter Content */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography>{chapter.content}</Typography>
        </Paper>
        {!chapter.isOfficial &&
          chapter.chapterNumber === story.currentRound.chapterNumber &&
          new Date(story.currentRound.deadline) > new Date() && (
            <Button variant="contained" color="primary" onClick={handleVote}>
              Vote for this Chapter
            </Button>
          )}
      </Container>
    </>
  );
};

export default ChapterPage;
