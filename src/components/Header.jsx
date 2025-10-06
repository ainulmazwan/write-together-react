import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link } from "react-router";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies("currentuser");

  const { currentuser } = cookies;

  const handleOpenModal = async (id) => {
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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>

          <MenuBookIcon sx={{ marginRight: 3 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WriteTogether
          </Typography>
          <Button color="inherit" component={Link} to="/stories">
            Stories
          </Button>

          {currentuser ? (
            <>
              <Button color="inherit" component={Link} to="/stories/new">
                Create
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
          ) : (
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
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
