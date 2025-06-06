import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { Spin } from "hamburger-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserAuth } from "../../context/UserAuthContext";
const MotionNavLink = motion.create(NavLink);

export default function NavBar({ data }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useUserAuth();

  const navLinksRef = useRef(null);

  const pages = [
    { link: "/", name: "Home" },
    { link: "/registration", name: "Registration" },
    { link: "/committees", name: "Committees" },
    { link: "/submission", name: "Submission" },
    { link: "/program", name: "Program" },
    { link: "/local-informations", name: "Local Informations" },
  ];

  if (isAuthenticated) {
    pages.push({ link: "/profile", name: "Profile" });
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isOpen &&
        navLinksRef.current &&
        !navLinksRef.current.contains(e.target)
      ) {
        const timer = setTimeout(() => {
          setIsOpen(false);
        }, 100);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const containerVariants = {
    open: {
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const linkVariants = {
    open: {
      // opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "circOut",
      },
    },
    closed: {
      // opacity: 0,
      x: "-150%",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <nav>
      <h2 className="nav-title" onClick={() => navigate("/")}>
        {data.acronym + " " + data.year}
      </h2>

      <motion.div
        ref={navLinksRef}
        className={`nav-links ${isOpen ? "active" : ""}`}
        variants={containerVariants}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
      >
        {pages.map((page) => (
          <div key={page.name} className="nav-link-container">
            <MotionNavLink
              to={page.link}
              className="nav-link"
              variants={linkVariants}
              onClick={() => setIsOpen(false)}
              end={false}
            >
              {page.name}
            </MotionNavLink>
          </div>
        ))}
        <div className="button-container">
          {isAuthenticated ? (
            <button
              className="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                className="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/sign-up");
                }}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </motion.div>

      <Spin
        toggled={isOpen}
        toggle={setIsOpen}
        color="var(--primary-color)"
        className="burger-button"
      />
    </nav>
  );
}
