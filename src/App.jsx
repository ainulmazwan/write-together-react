import StoriesPage from "./pages/StoriesPage";
import StoryPage from "./pages/StoryPage";
import SignupPage from "./pages/SignupPage";
import StoryAdd from "./pages/StoryAdd";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
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
            <Route path="/stories/new" element={<StoryAdd />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
