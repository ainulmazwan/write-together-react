import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { signup } from "../utils/api_users";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";

const SignupPage = () => {
  const [cookies, setCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const navigate = useNavigate();

  useEffect(() => {
    if (currentuser) {
      navigate("/");
    }
  }, [currentuser]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Fill in all the fields");
    } else if (password !== confirmPassword) {
      toast.error("Passwords should match");
    } else {
      try {
        const userData = await signup(name, email, password);
        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // expire in 8 hours
        });
        // toast and navigate
        toast.success("Account has been created!");
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
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: 3, my: 5 }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", mb: 5 }}
              fontWeight={700}
            >
              Sign Up
            </Typography>
            <Box mb={2}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                slotProps={{ htmlInput: { maxLength: 30 } }}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Box>
            <Box mb={2}>
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
            <Box mb={2}>
              <TextField
                type="password"
                label="Confirm password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth onClick={handleSignup}>
              Sign Up
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default SignupPage;
