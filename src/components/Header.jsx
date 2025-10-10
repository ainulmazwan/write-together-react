import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link } from "react-router";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function Header() {
  const [cookies, , removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  const handleOpenModal = async () => {
    Swal.fire({
      title: "Login Required",
      text: "You need to be logged in to create a story.",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Login",
      denyButtonText: "Sign Up",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      } else if (result.isDenied) {
        window.location.href = "/signup";
      }
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MenuBookIcon sx={{ marginRight: 3, marginLeft: 4 }} />
            WriteTogether
          </Typography>

          {/* users link only for admins */}
          {currentuser?.role === "admin" && (
            <Button color="inherit" component={Link} to="/users">
              Users
            </Button>
          )}

          <Button color="inherit" component={Link} to="/stories">
            Stories
          </Button>

          {/* normal user logged in */}
          {currentuser?.role === "user" ? (
            <>
              <Button color="inherit" component={Link} to="/stories/new">
                Create
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                Your Profile
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  removeCookie("currentuser");
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </>
          ) : null}

          {/* admin logged in */}
          {currentuser?.role === "admin" ? (
            <>
              <Button color="inherit" component={Link} to="/genres">
                Genres
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  removeCookie("currentuser");
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </>
          ) : null}

          {/* not logged in */}
          {!currentuser ? (
            <>
              <Button color="inherit" onClick={handleOpenModal}>
                Create
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
