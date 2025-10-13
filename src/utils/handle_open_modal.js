import Swal from "sweetalert2";

export const handleOpenModal = ({
  text = "You need to be logged in to access this feature", // backup text
}) => {
  Swal.fire({
    title: "Login Required",
    text: text,
    icon: "warning",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Login",
    denyButtonText: "Sign Up",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) window.location.href = "/login";
    else if (result.isDenied) window.location.href = "/signup";
  });
};
