import { NavLink, useNavigate } from "react-router-dom";
import "./AdminNavBar.css";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showFeedback } = useFeedback();

  const handleLogout = () => {
    logout(); // Appel à la fonction logout
    showFeedback("success", "Disconnected");
    navigate("/admin/login"); // Rediriger l'utilisateur vers la page de login après déconnexion
  };

  return (
    <nav className="admin-nav">
      <div className="link-container">
        <h2 className="nav-title" onClick={() => navigate("/Admin")}>
          ICSC Dashboard
        </h2>
        <NavLink to={"/admin"} className={"nav-link"} end>
          Home
        </NavLink>
        <NavLink to={"/admin/conferences"} className={"nav-link"}>
          Conferences
        </NavLink>
        <NavLink to={"/admin/topics"} className={"nav-link"}>
          Topics
        </NavLink>
        <NavLink to={"/admin/articles"} className={"nav-link"}>
          Articles
        </NavLink>
      </div>
      <button onClick={handleLogout} className="button">
        Logout
      </button>
    </nav>
  );
}
