import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import { Box, Button, TextField, Typography } from "@mui/material";
import { getStoryById } from "../utils/api_stories";
import { getChapter, updateChapter } from "../utils/api_chapters";
import { toast } from "sonner";
import Loading from "../components/Loading";

const ChapterUpdate = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const navigate = useNavigate();
  const { id, chapterId } = useParams();

  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
      return;
    }
    // get chapter content and story info
    const fetchData = async () => {
      try {
        getStoryById(id).then((data) => {
          setStory(data);
        });
        getChapter(chapterId).then((data) => {
          setChapter(data);
          setContent(data.content);
        });
      } catch (error) {
        console.log("Error fetching story: ", error);
      }
    };

    fetchData();
  }, [currentuser, id]);

  if (!story || !chapter) {
    return <Loading />;
  }

  const handleSubmit = async () => {
    // check if empty
    if (!content) {
      toast.error("You must fill in all the fields");
    } else {
      await updateChapter(chapterId, { content }, currentuser.token);
      toast.success(`Successfully updated chapter!`);
      navigate(`/stories/${id}/chapters/${chapterId}`);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Chapter {chapter.chapterNumber}
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

export default ChapterUpdate;
