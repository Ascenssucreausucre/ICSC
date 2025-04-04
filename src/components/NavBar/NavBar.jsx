import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ data }) {
  const navigate = useNavigate();
  return (
    <nav>
      <h2 className="nav-title" onClick={() => navigate("/")}>
        {data.acronym + " " + data.year}
      </h2>
      <NavLink to={"/"} className={"nav-link"}>
        Home
      </NavLink>
      <NavLink to={"/registration"} className={"nav-link"}>
        Registration
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
