import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { login } from "../utils/api_users";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import Header from "../components/Header";

const LoginPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentuser) {
      navigate("/");
    }
  }, [currentuser]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Fill in all the fields");
    } else {
      try {
        const userData = await login(email, password);

        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // expire in 8 hours
        });

        toast.success("Successfully logged in!");
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
      <Typography variant="h3" sx={{ textAlign: "center", my: 5 }}>
        Log In
      </Typography>
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: 4 }}>
          <CardContent>
            <Box mb={2}>
              <Typography>Email</Typography>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Box>
            <Box mb={2}>
              <Typography>Password</Typography>
              <TextField
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth onClick={handleLogin}>
              Log In
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default LoginPage;
