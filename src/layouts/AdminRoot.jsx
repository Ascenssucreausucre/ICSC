import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar/AdminNavBar";
import { Feedback } from "../components/Feedback/Feedback";
import AdminFormModal from "../components/AdminFormModal/AdminFormModal";

function AdminRoot() {
  return (
    <>
      <AdminNavBar />
      <main>
        <Feedback />
        <AdminFormModal />
        <Outlet />
      </main>
    </>
  );
}

export default AdminRoot;
