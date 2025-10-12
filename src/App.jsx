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

function App() {
  return (
    <>
      <CookiesProvider>
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
          <Toaster />
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
