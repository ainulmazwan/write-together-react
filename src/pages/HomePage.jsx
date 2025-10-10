import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate, Link } from "react-router";
import { useCookies } from "react-cookie";
import Header from "../components/Header";

const HomePage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  return (
    <>
      <Header />
      {currentuser?.role === "user" || !currentuser ? (
        <>
          <Container
            maxWidth="md"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: "80vh",
              px: 3,
            }}
          >
            <Typography
              variant="h2"
              fontWeight="700"
              gutterBottom
              sx={{ mb: 2 }}
            >
              WriteTogether
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 5, lineHeight: 1.6 }}
            >
              Collaborative storytelling made simple. Take turns building
              stories with writers from around the world.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {!currentuser && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{ minWidth: 140 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/signup")}
                    sx={{ minWidth: 140 }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <Button
                variant="text"
                color="secondary"
                size="large"
                onClick={() => navigate("/stories")}
                sx={{ minWidth: 140 }}
              >
                Browse Stories
              </Button>
            </Box>
          </Container>
        </>
      ) : (
        <>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              gutterBottom
              sx={{ mb: 4 }}
            >
              Welcome, Admin
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              <Grid key={1} item size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  fullWidth
                  component={Link}
                  to="/users"
                  sx={{
                    textTransform: "none",
                    p: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      minHeight: 150,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                      p: 5,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      Manage Users
                    </Typography>
                  </Card>
                </Button>
              </Grid>

              <Grid key={2} item size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  fullWidth
                  component={Link}
                  to="/stories"
                  sx={{
                    textTransform: "none",
                    p: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      minHeight: 150,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                      p: 5,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      Manage Stories
                    </Typography>
                  </Card>
                </Button>
              </Grid>
              <Grid key={3} item size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  fullWidth
                  component={Link}
                  to="/genres"
                  sx={{
                    textTransform: "none",
                    p: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      minHeight: 150,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                      p: 5,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      Manage Genres
                    </Typography>
                  </Card>
                </Button>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
};

export default HomePage;
