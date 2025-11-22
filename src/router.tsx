import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Layout from "./app/layout";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Layout/>,
        children: [
            {path: "/", Component: HomePage},
            {path: "/profile", Component: ProfilePage},
            {path: "/messages", Component: MessagesPage}
        ]
    },
    {path: "/forgot-password", Component: ForgotPasswordPage},
    {path: "/login", Component: LoginPage},
    {path: "/signup", Component: SignupPage}
])