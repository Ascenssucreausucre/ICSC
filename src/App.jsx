import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import CallForPaper from "./pages/C4P/CallForPaper";
import Footer from "./components/Footer/Footer";
import Comittees from "./pages/Comittees/Comittees";
import Submission from "./pages/Submission/Submission";
import Program from "./pages/Program/Program";
import SpecialSessions from "./pages/SpecialSessions/SpecialSessions";
import Registration from "./pages/Registration/Registration";
import Workshops from "./pages/Workshops/Workshops";
import LocalInfo from "./pages/LocalInfo/LocalInfo";
import Archives from "./pages/Archives/Archives";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "comittees",
        element: <Comittees />,
      },
      {
        path: "submission",
        element: <Submission />,
      },
      {
        path: "program",
        element: <Program />,
      },
      {
        path: "special-sessions",
        element: <SpecialSessions />,
      },
      {
        path: "workshops",
        element: <Workshops />,
      },
      {
        path: "local-info",
        element: <LocalInfo />,
      },
      {
        path: "archives",
        element: <Archives />,
      },
    ],
  },
]);

function Root() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
