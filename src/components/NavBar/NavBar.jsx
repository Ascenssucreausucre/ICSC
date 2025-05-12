import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { Spin } from "hamburger-react";
import { useState } from "react";

export default function NavBar({ data }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

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
    { link: "/program", name: "Program" },
    { link: "/local-informations", name: "Local Informations" },
  ];
  return (
    <nav>
      <h2 className="nav-title" onClick={() => navigate("/")}>
        {data.acronym + " " + data.year}
      </h2>
      <div className={`nav-links ${isOpen && "active"}`}>
        {pages.map((page) => (
          <NavLink
            to={page.link}
            className={"nav-link"}
            key={page.name}
            onClick={() => setIsOpen(false)}
          >
            {page.name}
          </NavLink>
        ))}
      </div>

      <Spin
        toggled={isOpen}
        toggle={setIsOpen}
        color="var(--primary-color)"
        className="burger-button"
      />
    </nav>
  );
}
