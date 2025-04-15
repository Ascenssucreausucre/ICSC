import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/public/Home/Home";
import Comittees from "../pages/public/Comittees/Comittees";
import Program from "../pages/public/Program/Program";
import SpecialSessions from "../pages/public/SpecialSessions/SpecialSessions";
import Registration from "../pages/public/Registration/Registration";
import Workshops from "../pages/public/Workshops/Workshops";
import LocalInfo from "../pages/public/LocalInfo/LocalInfo";
import Archives from "../pages/public/Archives/Archives";
import AdminLogin from "../pages/Admin/AdminLogin/AdminLogin";
import AdminMainPage from "../pages/Admin/AdminMainPage/AdminMainPage";
import Root from "../layouts/Root"; // Layout pour le front
import AdminRoot from "../layouts/AdminRoot"; // Layout pour l'admin
import PrivateRoute from "../components/PrivateRoute"; // Import du composant PrivateRoute
import Conferences from "../pages/Admin/Conferences/Conferences";
import Conference from "../pages/Admin/Conference/Conference";
import { AuthProvider } from "../context/AuthContext";
import { FeedbackProvider } from "../context/FeedbackContext";
import { AdminModalProvider } from "../context/AdminModalContext";
import Submission from "../pages/public/Submission/Submission";

const API_URL = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
        loader: () => fetch(`${API_URL}/front-routes/homepage-data`),
      },
      { path: "committees", element: <Comittees /> },
      {
        path: "registration",
        element: <Registration />,
        loader: () =>
          fetch(`${API_URL}/front-routes/registration-fees/current`),
      },
      { path: "submission", element: <Submission /> },
      { path: "program", element: <Program /> },
      { path: "special-sessions", element: <SpecialSessions /> },
      { path: "workshops", element: <Workshops /> },
      { path: "local-info", element: <LocalInfo /> },
      { path: "archives", element: <Archives /> },
    ],
  },
  {
    path: "/admin/login",
    element: (
      <FeedbackProvider>
        <AuthProvider>
          <AdminLogin />
        </AuthProvider>
      </FeedbackProvider>
    ),
  },
  {
    path: "/admin",
    element: (
      <FeedbackProvider>
        <AuthProvider>
          <AdminModalProvider>
            <PrivateRoute />
          </AdminModalProvider>
        </AuthProvider>
      </FeedbackProvider>
    ),

    children: [
      {
        path: "",
        element: <AdminRoot />,
        children: [
          {
            path: "",
            element: <AdminMainPage />,
            loader: () => fetch(`${API_URL}/Conferences/current`),
          },
          {
            path: "conferences",
            element: <Conferences />,
          },
          {
            path: "conferences/:id",
            element: <Conference />,
          },
        ],
      },
    ],
  },
]);

export default router;
