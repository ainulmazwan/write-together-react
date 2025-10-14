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
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router";
import { getUsers, deleteUser } from "../utils/api_users";
import { getStoriesByAuthor } from "../utils/api_stories";
import { getChaptersByAuthor } from "../utils/api_chapters";
import { toast } from "sonner";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentuser || currentuser.role !== "admin") {
      navigate("/");
    }
    getUsers(currentuser.token).then((data) => {
      setUsers(data);
    });
  }, [currentuser]);

  const handleDeleteModal = async (id) => {
    try {
      // get stories and chapters by user
      const [stories, chapters] = await Promise.all([
        //basically does both promises/awaits at the same time
        getStoriesByAuthor(id, currentuser.token),
        getChaptersByAuthor(id, currentuser.token),
      ]);

      const storyCount = stories.length;
      const chapterCount = chapters.length;

      const result = await Swal.fire({
        title: "Are you sure you want to delete this user?",
        html: `
        <p>This user has <b>${storyCount}</b> stories and <b>${chapterCount}</b> chapters.</p><br />
        <p>Deleting this user will reassign their content to the deleted user account.</p>
      `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete user",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteUser(id, currentuser.token);
        toast.success("User deleted successfully");
        // refresh users list
        const updatedUsers = await getUsers(currentuser.token);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting user");
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Manage Users
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">User</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Email</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">Action</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length !== 0 ? (
                  users.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {user.name}
                      </TableCell>
                      <TableCell component="th" scope="row" align="left">
                        {user.email}
                      </TableCell>
                      <TableCell align="right">
                        {user.role !== "admin" ? (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              component={Link}
                              to={`/users/${user._id}`}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ marginLeft: 2 }}
                              onClick={() => {
                                handleDeleteModal(user._id);
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>no users yet</>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </>
  );
};

export default UsersPage;
