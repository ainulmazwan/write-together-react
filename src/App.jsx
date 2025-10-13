import StoriesPage from "./pages/StoriesPage";
import StoryPage from "./pages/StoryPage";
import StoryUpdate from "./pages/StoryUpdate";
import ChapterPage from "./pages/ChapterPage";
import ChapterUpdate from "./pages/ChapterUpdate";
import SignupPage from "./pages/SignupPage";
import StoryAdd from "./pages/StoryAdd";
import ChapterAdd from "./pages/ChapterAdd";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import GenresPage from "./pages/GenresPage";
import UsersPage from "./pages/UsersPage";
import UserUpdate from "./pages/UserUpdate";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";
import { createTheme, ThemeProvider } from "@mui/material";
import { purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: purple[900],
    },
  },
});

function App() {
  return (
    <>
      <CookiesProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/stories/:id" element={<StoryPage />} />
              <Route path="/stories/update/:id" element={<StoryUpdate />} />
              <Route path="/stories/:id/submit" element={<ChapterAdd />} />
              <Route path="/stories/:id/submit" element={<ChapterAdd />} />
              <Route
                path="/stories/:id/chapters/:chapterId"
                element={<ChapterPage />}
              />
              <Route
                path="/stories/:id/chapters/:chapterId/update"
                element={<ChapterUpdate />}
              />
              <Route path="/stories/new" element={<StoryAdd />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:userId" element={<UserUpdate />} />
            </Routes>
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                success: {
                  style: {
                    background: "#22c55e", // green
                    color: "white",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444", // red
                    color: "white",
                  },
                },
              }}
            />
          </BrowserRouter>
        </ThemeProvider>
      </CookiesProvider>
    </>
  );
}

export default App;
