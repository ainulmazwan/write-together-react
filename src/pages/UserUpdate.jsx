import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { getUserById, updateUser } from "../utils/api_users";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import Header from "../components/Header";

const UserUpdate = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { userId } = useParams();

  useEffect(() => {
    if (!currentuser || currentuser.role !== "admin") {
      navigate("/");
    }
    getUserById(userId).then((data) => {
      setUser(data);
      setName(data.name);
      setRole(data.role);
    });
  }, [currentuser]);

  const handleUpdate = async () => {
    const updates = { name, role };
    // include password if changed
    if (!name || !role) {
      toast.error("Please fill in the updated name");
      return;
    }
    if (password) {
      updates.password = password;
    }
    try {
      await updateUser(userId, updates, currentuser.token);
      toast.success("User successfully updated!");
      navigate("/users");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user.");
    }
  };

  return (
    <>
      <Header />
      <Typography variant="h3" sx={{ textAlign: "center", my: 5 }}>
        Update User
      </Typography>
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: 4 }}>
          <CardContent>
            <Box mb={2}>
              <Typography>Name</Typography>
              <TextField
                fullWidth
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Box>
            <Box mb={2}>
              <Typography>Reset Password (optional)</Typography>
              <TextField
                type="password"
                fullWidth
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Genre"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth onClick={handleUpdate}>
              Update
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default UserUpdate;
