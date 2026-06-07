import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import { AppLayout } from "./layout/AppLayout.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { GlobalBoardPage } from "./pages/GlobalBoardPage.tsx";
import { FeedPage } from "./pages/FeedPage.tsx";
import { CommunitiesPage } from "./pages/CommunitiesPage.tsx";
import { CommunityPage } from "./pages/CommunityPage.tsx";
import { PostPage } from "./pages/PostPage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Navigate to="/global" replace /> },
      { path: "/global", element: <GlobalBoardPage /> },
      { path: "/feed", element: <FeedPage /> },
      { path: "/communities", element: <CommunitiesPage /> },
      { path: "/c/:slug", element: <CommunityPage /> },
      { path: "/posts/:id", element: <PostPage /> },
      { path: "/u/:username", element: <ProfilePage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
