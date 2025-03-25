import { NavLink, useNavigate } from "react-router-dom";
import { globalInfos } from "../../fakeDatas";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <nav>
      <h2 className="nav-title" onClick={() => navigate("/")}>
        ICSC {globalInfos.year}
      </h2>
      <NavLink to={"/"} className={"nav-link"}>
        Home
      </NavLink>
      <NavLink to={"/submission"} className={"nav-link"}>
        Submission
      </NavLink>
      <NavLink to={"/program"} className={"nav-link"}>
        Program
      </NavLink>
      <NavLink to={"/comittees"} className={"nav-link"}>
        Comittees
      </NavLink>
      <NavLink to={"/special-Sessions"} className={"nav-link"}>
        Special Sessions
      </NavLink>
      <NavLink to={"/workshops"} className={"nav-link"}>
        Workshops
      </NavLink>
      <NavLink to={"/local-Info"} className={"nav-link"}>
        Local Info
      </NavLink>
      <NavLink to={"/archives"} className={"nav-link"}>
        Archives
      </NavLink>
    </nav>
  );
}
