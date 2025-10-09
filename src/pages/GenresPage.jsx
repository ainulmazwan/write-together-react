import Header from "../components/Header";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import {
  getGenres,
  addGenre,
  editGenre,
  deleteGenre,
} from "../utils/api_genres";
import { toast } from "sonner";

const GenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentuser || currentuser.role !== "admin") {
      navigate("/");
    }
    getGenres().then((data) => {
      setGenres(data);
    });
  }, [currentuser]);

  const handleAddModal = () => {
    Swal.fire({
      title: "Add New Genre",
      input: "text",
      inputPlaceholder: "Enter a genre name (ie. Fantasy)",
      showCancelButton: true,
      confirmButtonText: "Add Genre",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#9e9e9e",
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Please enter a genre name.";
        }
      },
    }).then(async (result) => {
      if (!result.value) {
      } else {
        await addGenre(result.value);
        const updatedGenres = await getGenres();
        setGenres(updatedGenres);
        toast.success(`Genre "${result.value}" added!`);
        return;
      }
    });
  };

  const handleEditModal = (id) => {
    const genre = genres.find((genre) => genre._id === id);
    Swal.fire({
      title: "Edit Existing Genre",
      input: "text",
      inputValue: genre.name,
      inputPlaceholder: "Enter updated genre name",
      showCancelButton: true,
      confirmButtonText: "Add Genre",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#9e9e9e",
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Please enter updated genre name.";
        }
      },
    }).then(async (result) => {
      if (!result.value) {
      } else {
        await editGenre(id, result.value);
        const updatedGenres = await getGenres();
        setGenres(updatedGenres);
        toast.success(`Genre edited!`);
        return;
      }
    });
  };

  const handleDeleteModal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGenre(id);
          const updatedGenres = await getGenres();
          setGenres(updatedGenres);
        } catch (error) {
          toast.error("Genre is currently in use");
        }
      }
    });
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Manage Genres
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
            onClick={handleAddModal}
          >
            Add Genre <AddIcon sx={{ marginLeft: 2 }} />
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Genre</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">Action</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {genres.length === 0 ? (
                  <>no genres yet</>
                ) : (
                  genres.map((genre) => (
                    <TableRow
                      key={genre._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {genre.name}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleEditModal(genre._id);
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ marginLeft: 2 }}
                          onClick={() => {
                            handleDeleteModal(genre._id);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </>
  );
};

export default GenresPage;
