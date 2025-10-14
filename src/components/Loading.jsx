import Header from "./Header";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Box";

const Loading = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "85vh",
        }}
      >
        <CircularProgress sx={{ mx: 2 }} />
        <Typography variant="h5">Loading...</Typography>
      </Box>
    </>
  );
};

export default Loading;
