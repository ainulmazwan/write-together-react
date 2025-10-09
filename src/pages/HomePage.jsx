import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router";
import Header from "../components/Header";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to WriteTogether
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          A collaborative storytelling platform where writers take turns
          building stories together.
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mx: 2 }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{ mx: 2 }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
          <Button
            variant="text"
            color="secondary"
            size="large"
            onClick={() => navigate("/stories")}
          >
            Browse Stories
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
