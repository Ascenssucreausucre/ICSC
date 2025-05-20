import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./AdminNavBar.css";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Spin } from "hamburger-react";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";

const MotionNavLink = motion.create(NavLink);

export default function AdminNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navLinksRef = useRef(null);

  const { logout, adminRole } = useAuth();
  const { showFeedback } = useFeedback();

  const pages = [
    { link: "/admin", name: "Home" },
    { link: "/admin/conferences", name: "Conferences" },
    { link: "/admin/authors", name: "Authors" },
    { link: "/admin/notifications", name: "Notification" },
  ];

  if (adminRole === "superadmin") {
    pages.push({ link: "/admin/admins", name: "Admins" });
  }

  const handleLogout = () => {
    logout();
    showFeedback("success", "Disconnected");
    navigate("/admin/login");
  };

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
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const linkVariants = {
    open: {
      x: 0,
      transition: { duration: 0.3, ease: "circOut" },
    },
    closed: {
      x: "-150%",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <nav className="admin-nav">
      <h2 className="nav-title" onClick={() => navigate("/admin")}>
        ICSC Dashboard
      </h2>

      <motion.div
        ref={navLinksRef}
        className={`nav-links ${isOpen ? "active" : ""}`}
        variants={containerVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        {pages.map((page) => (
          <div key={page.name}>
            <MotionNavLink
              to={page.link}
              className={`nav-link ${
                location.pathname === page.link ? "active" : ""
              }`}
              variants={linkVariants}
              onClick={() => setIsOpen(false)}
              end
            >
              {page.name}
            </MotionNavLink>
          </div>
        ))}

        <button onClick={handleLogout} className="button logout-button">
          Logout
        </button>
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
