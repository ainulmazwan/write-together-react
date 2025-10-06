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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const StoryAdd = () => {
  const navigate = useNavigate();

  const [cookies] = useCookies("currentuser");
  const { currentuser } = cookies;

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [votingWindow, setVotingWindow] = useState(null);
  const [description, setDescription] = useState("")
  const [chapter1, setChapter1] = useState("")

  useEffect(() => {
    if (!currentuser) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2} sx={{ my: 5 }}>
          Create New Story
        </Typography>
        <Box mb={2}>
          <TextField label="Title" fullWidth />
        </Box>
        <Box mb={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Genre
            </InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select">
              <MenuItem value={1}>Fantasy</MenuItem>
              <MenuItem value={2}>Non-Fiction</MenuItem>
              <MenuItem value={3}>Romance</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker label="Publish Date/Time" />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box mb={2}>
          <TextField label="Voting Window (days)" type="number" fullWidth />
        </Box>
        <Box mb={2}>
          <TextField label="Description" fullWidth multiline rows={3} />
        </Box>
        <Box mb={2}>
          <TextField label="Chapter 1" fullWidth multiline rows={10} />
        </Box>
        <Box mb={2} sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button component="label" variant="contained" tabIndex={-1}>
            Upload image
          </Button>
        </Box>
        <Box mb={2}>
          <Button variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default StoryAdd;
