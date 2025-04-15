import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar/AdminNavBar";
import { Feedback } from "../components/Feedback/Feedback";
import AdminFormModal from "../components/AdminFormModal/AdminFormModal";
import "./admin.css";
import { Helmet } from "react-helmet";

function AdminRoot() {
  return (
    <>
      <Helmet>
        <title>ICSC Admin Dashboard</title>
      </Helmet>
      <AdminNavBar />
      <div className="admin-main-wrapper">
        <main className="admin-main">
          <Feedback />
          <AdminFormModal />
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AdminRoot;
