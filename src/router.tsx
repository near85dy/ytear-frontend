import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";

export const router = createBrowserRouter([
    {path: "/", Component: HomePage},
    {path: "/login", Component: LoginPage},
    {path: "/signup", Component: SignupPage}
])