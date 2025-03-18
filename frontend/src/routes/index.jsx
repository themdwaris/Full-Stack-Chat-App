import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyPassword from "../pages/VerifyPassword";
import Home from "../pages/Home";
import Messages from "../components/Messages";
import Forgot from "../pages/Forgot";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "register", element: <Register /> },
      { path: "verifyEmail", element: <VerifyEmail /> },
      { path: "verifyPassword", element: <VerifyPassword /> },
      { path: "forgot", element: <Forgot /> },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <Messages />,
          },
        ],
      },
    ],
  },
]);

export default router
