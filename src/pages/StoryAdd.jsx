import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getGenres } from "../utils/api_genres";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { addStory } from "../utils/api_stories";
import { toast } from "sonner";

const StoryAdd = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies("currentuser");
  const { currentuser } = cookies;

  const [genres, setGenres] = useState([]);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [publishDate, setPublishDate] = useState(null);
  const [votingWindow, setVotingWindow] = useState(null);
  const [description, setDescription] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
      return;
    }

    getGenres().then((data) => {
      setGenres(data);
    });
  }, [currentuser]);

  const handleSubmit = async () => {
    if (
      !title ||
      !genre ||
      !publishDate ||
      !votingWindow ||
      !description ||
      !chapterContent
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      const author = currentuser._id;
      const deadline = publishDate
        .add(Number(votingWindow), "day")
        .toISOString();

      const story = await addStory(
        title,
        description,
        genre,
        author,
        publishDate.toISOString(),
        votingWindow,
        deadline,
        chapterContent,
        currentuser.token
      );

      toast.success(`Story "${story.title}" created!`);
      navigate("/profile");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error creating story");
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: 3,
            p: 5,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Create a New Story
          </Typography>

          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
              >
                {genres.length !== 0 ? (
                  genres.map((genre) => (
                    <MenuItem value={genre._id}>{genre.name}</MenuItem>
                  ))
                ) : (
                  <MenuItem>No Genre</MenuItem>
                )}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                disablePast
                label="Publish Date/Time"
                slotProps={{ textField: { fullWidth: true } }}
                value={publishDate}
                onChange={(newValue) => setPublishDate(newValue)}
              />
            </LocalizationProvider>

            <TextField
              label="Voting Window (days)"
              type="number"
              fullWidth
              value={votingWindow}
              onChange={(e) => setVotingWindow(e.target.value)}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              label="Chapter 1 Content"
              fullWidth
              multiline
              rows={10}
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2, py: 1.4, fontWeight: 600 }}
              onClick={handleSubmit}
            >
              Create Story
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default StoryAdd;
