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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { addStory } from "../utils/api_stories";
import { toast } from "sonner";

const StoryAdd = () => {
  const navigate = useNavigate();

  const [cookies] = useCookies("currentuser");
  const { currentuser } = cookies;

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [publishDate, setPublishDate] = useState(null);
  const [votingWindow, setVotingWindow] = useState(null);
  const [description, setDescription] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
    }
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
      toast.error("Fill in all the fields");
    } else {
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
          chapterContent
        );
        // toast and navigate
        toast.success("Story " + story.title + " created!");
        navigate("/");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2} sx={{ my: 5 }}>
          Create New Story
        </Typography>
        <Box mb={2}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Box>
        <Box mb={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Genre
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
              }}
            >
              <MenuItem value="68e3cce7b2b124f59fa04578">Fantasy</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box components={["DateTimePicker"]}>
              <DateTimePicker
                disablePast
                label="Publish Date/Time"
                slotProps={{ textField: { fullWidth: true } }}
                value={publishDate}
                onChange={(newValue) => setPublishDate(newValue)}
              />
            </Box>
          </LocalizationProvider>
        </Box>
        <Box mb={2}>
          <TextField
            label="Voting Window (days)"
            type="number"
            fullWidth
            value={votingWindow}
            onChange={(e) => {
              setVotingWindow(e.target.value);
            }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Chapter 1"
            fullWidth
            multiline
            rows={10}
            value={chapterContent}
            onChange={(e) => {
              setChapterContent(e.target.value);
            }}
          />
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default StoryAdd;
