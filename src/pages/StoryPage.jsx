import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Header from "../components/Header";

const StoryPage = () => {
  return (
    <>
      <Header />
      {/* Header */}
      <Box sx={{ maxWidth: 800, margin: "0 auto", py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Story Title
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          by Jojo | Genre: Fantasy
        </Typography>
      </Box>

      {/* Main two-column layout */}
      <Paper maxWidth="md" sx={{ mx: 2, p: 5 }}>
        <Container>
          <Typography variant="h5" sx={{ my: 2 }}>
            Description
          </Typography>
          <Typography>
            This is a captivating fantasy story that takes readers on an epic
            journey through magical realms and heroic quests. Join the
            protagonist as they navigate challenges, forge alliances, and
            discover their true destiny in a world filled with wonder and
            adventure.
          </Typography>
        </Container>
        <Container>
          <Typography variant="h5" sx={{ my: 3 }}>
            Chapter List
          </Typography>
          <Box
            sx={{
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 2,
            }}
          >
            <Button variant="none">
              <Typography>Chapter 1</Typography>
            </Button>
            <Button variant="none">
              <Typography>Chapter 2</Typography>
            </Button>
            <Button variant="none">
              <Typography>Chapter 3</Typography>
            </Button>
          </Box>
        </Container>
        <Container>
          <Typography variant="h5" sx={{ my: 2 }}>
            Current Round: Chapter 4
          </Typography>

          <Box
            sx={{
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 2,
            }}
          >
            <Button variant="none">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>Submission 1: by User</Typography>
                <Typography>#1 : 27 votes</Typography>
              </Box>
            </Button>
            <Button variant="none">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>Submission 1: by User</Typography>
                <Typography>#1 : 27 votes</Typography>
              </Box>
            </Button>
            <Button variant="none">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>Submission 1: by User</Typography>
                <Typography>#1 : 27 votes</Typography>
              </Box>
            </Button>
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default StoryPage;
