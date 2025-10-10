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
import { toast } from "sonner";
import { useParams } from "react-router";
import { getStoryById, updateStory } from "../utils/api_stories";

const StoryUpdate = () => {
  const [genres, setGenres] = useState([]);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [votingWindow, setVotingWindow] = useState(1);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
    }
    getGenres().then((data) => {
      setGenres(data);
    });

    getStoryById(id)
      .then((data) => {
        setTitle(data.title);
        setGenre(data.genre._id);
        setVotingWindow(data.votingWindow);
        setDescription(data.description);
      })
      .catch((error) => {
        toast.error(error);
      });
  }, [currentuser]);

  const handleSubmit = async () => {
    if (!title || !genre || !votingWindow || !description) {
      toast.error("Please fill in all the fields");
      return;
    }
    try {
      const updates = { title, genre, votingWindow, description };
      await updateStory(id, updates, currentuser.token);
      toast.success("Story updated!");
      navigate("/stories/" + id);
    } catch (error) {
      toast.error("error: " + error);
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
            Update Story
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
                  <MenuItem>No Genres</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              label="Voting Window (days)"
              type="number"
              fullWidth
              value={votingWindow}
              helperText="Changes to the voting window will apply to future rounds only."
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

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2, py: 1.4, fontWeight: 600 }}
              onClick={handleSubmit}
            >
              Update Story
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default StoryUpdate;
