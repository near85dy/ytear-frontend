import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Layout from "./app/layout";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Layout/>,
        children: [
            {path: "/", Component: HomePage}
        ]
    },
    {path: "/forgot-password", Component: ForgotPasswordPage},
    {path: "/login", Component: LoginPage},
    {path: "/signup", Component: SignupPage}
])