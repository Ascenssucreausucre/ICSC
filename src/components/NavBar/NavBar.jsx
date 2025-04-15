import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ data }) {
  const navigate = useNavigate();

  const pages = [
    {
      link: "/",
      name: "Home",
    },
    {
      link: "/registration",
      name: "Registration",
    },
    {
      link: "/committees",
      name: "Committees",
    },
    {
      link: "/submission",
      name: "Submission",
    },
  ];
  return (
    <nav>
      <h2 className="nav-title" onClick={() => navigate("/")}>
        {data.acronym + " " + data.year}
      </h2>
      {pages.map((page) => (
        <NavLink to={page.link} className={"nav-link"} key={page.name}>
          {page.name}
        </NavLink>
      ))}
    </nav>
  );
}
