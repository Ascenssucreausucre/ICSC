import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/public/Home/Home";
import Comittees from "../pages/public/Comittees/Comittees";
import Program from "../pages/public/Program/Program";
import Registration from "../pages/public/Registration/Registration";
import LocalInfo from "../pages/public/LocalInfo/LocalInfo";
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
import ConferenceArticles from "../components/ConferenceArticles/ConferenceArticles";
import Authors from "../pages/Admin/Authors/Authors";
import Author from "../pages/Admin/Author/Author";
import CustomErrorPage from "../components/CustomErrorPage/CustomErrorPage";
import Admins from "../pages/Admin/Admins/Admins";
import Notifications from "../pages/Admin/Notifications/Notifications";

const API_URL = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <CustomErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
        loader: () => fetch(`${API_URL}/front-routes/homepage-data`),
      },
      {
        path: "committees",
        element: <Comittees />,
        loader: () => fetch(`${API_URL}/committee/current`),
      },
      {
        path: "registration",
        element: <Registration />,
        loader: () =>
          fetch(`${API_URL}/front-routes/registration-fees/current`),
      },
      {
        path: "submission",
        element: <Submission />,
        loader: () => fetch(`${API_URL}/front-routes/submission`),
      },
      {
        path: "program",
        element: <Program />,
        loader: () => fetch(`${API_URL}/front-routes/program`),
      },
      {
        path: "local-informations",
        element: <LocalInfo />,
        loader: () => fetch(`${API_URL}/local-informations/current`),
      },
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
          {
            path: "conferences/:id/articles",
            element: <ConferenceArticles />,
          },
          {
            path: "authors",
            element: <Authors />,
          },
          {
            path: "authors/:id",
            element: <Author />,
          },
          {
            path: "authors/country/:country",
            element: <Authors />,
          },
          {
            path: "admins",
            element: <Admins />,
          },
          { path: "notifications", element: <Notifications /> },
        ],
      },
    ],
  },
]);

export default router;
