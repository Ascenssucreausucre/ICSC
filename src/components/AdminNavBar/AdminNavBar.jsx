import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./AdminNavBar.css";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Spin } from "hamburger-react";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";

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
    { link: "/admin/notifications", name: "Notifications" },
    { link: "/admin/support", name: "Support" },
    { link: "/admin/users", name: "Users" },
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

  return (
    <nav className="admin-nav nav-bar">
      <h2 className="nav-title" onClick={() => navigate("/admin")}>
        ICSC Dashboard
      </h2>

      <motion.div
        ref={navLinksRef}
        className={`nav-links ${isOpen ? "active" : ""}`}
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        {pages.map((page) => (
          <div key={page.name}>
            <NavLink
              to={page.link}
              className={`nav-link ${
                location.pathname === page.link ? "active" : ""
              }`}
              onClick={() => setIsOpen(false)}
              end={page.name === "Home" ? true : false}
            >
              {page.name}
            </NavLink>
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
