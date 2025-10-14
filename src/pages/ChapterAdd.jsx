import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import { Box, Button, TextField, Typography } from "@mui/material";
import { getStoryById } from "../utils/api_stories";
import { addChapter } from "../utils/api_chapters";
import { toast } from "sonner";
import Loading from "../components/Loading";

const ChapterAdd = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const navigate = useNavigate();
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [content, setContent] = useState("");

  useEffect(() => {
    if (!currentuser || hasSubmitted || currentuser?.role === "admin") {
      navigate("/");
      return;
    }
    // check if user already submitted
    const fetchData = async () => {
      try {
        getStoryById(id).then((data) => {
          setStory(data);
        });
      } catch (error) {
        console.log("Error fetching story: ", error);
      }
    };

    fetchData();
  }, [currentuser, id, hasSubmitted]);

  useEffect(() => {
    if (!story) {
      return;
    }
    const userId = currentuser._id;
    // check if user has already submitted a chapter
    const alreadySubmitted = story.currentRound.submissions.some(
      (submission) => submission.author._id === userId
    );
    setHasSubmitted(alreadySubmitted);
  }, [story]);

  if (!story) {
    return <Loading />;
  }

  const handleSubmit = async () => {
    // check if empty
    if (!content) {
      toast.error("You must fill in all the fields");
    } else {
      await addChapter(story._id, content, currentuser._id, currentuser.token);
      toast.success(
        `Created submission for chapter ${story.currentRound.chapterNumber} of ${story.title}`
      );
      navigate(`/stories/${story._id}`);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Chapter {story.currentRound.chapterNumber}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {story.title}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={12}
          variant="outlined"
          placeholder="Write your chapter submission here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!content.trim() /* if no content, disable submit */}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ChapterAdd;
