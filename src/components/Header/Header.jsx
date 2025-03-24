import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <nav>
        <NavLink to={"/"} className={"nav-link"}>
          Home
        </NavLink>
        <NavLink to={"/Call-for-Papers"} className={"nav-link"}>
          Call for Papers
        </NavLink>
        <NavLink to={"/Comitees"} className={"nav-link"}>
          Comitees
        </NavLink>
        <NavLink to={"/Submission"} className={"nav-link"}>
          Submission
        </NavLink>
        <NavLink to={"/Program"} className={"nav-link"}>
          Program
        </NavLink>
        <NavLink to={"/Special-Sessions"} className={"nav-link"}>
          Special Sessions
        </NavLink>
        <NavLink to={"/Registration"} className={"nav-link"}>
          Registration
        </NavLink>
        <NavLink to={"/Workshops"} className={"nav-link"}>
          Workshops
        </NavLink>
        <NavLink to={"/Local-Info"} className={"nav-link"}>
          Local Info
        </NavLink>
        <NavLink to={"/Archives"} className={"nav-link"}>
          Archives
        </NavLink>
      </nav>
    </header>
  );
}
