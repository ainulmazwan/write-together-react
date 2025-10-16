import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { getUserById, updateUser, login } from "../utils/api_users";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import Header from "../components/Header";

const UserUpdate = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { userId } = useParams();

  useEffect(() => {
    if (
      currentuser?.role === "admin" ||
      currentuser?._id === userId // check if the one editing is the user to be updated
    ) {
      getUserById(userId).then((data) => {
        setName(data.name);
        setRole(data.role);
      });
    } else {
      navigate("/");
    }
  }, [currentuser]);

  const handleUpdate = async () => {
    const updates = { name };
    // include password if changed
    if (!name.trim()) {
      toast.error("Please fill in the updated name");
      return;
    }
    if (password.trim()) {
      updates.password = password;
    }
    try {
      await updateUser(userId, updates, currentuser.token);
      toast.success("User successfully updated!");
      if (currentuser.role == "admin") {
        navigate("/users");
      } else {
        setCookie(
          "currentuser",
          { ...currentuser, ...updates },
          {
            maxAge: 60 * 60 * 8, // expire in 8 hours
          },
          { path: "/" }
        );
        navigate("/profile");
      }
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
