import useFetch from "../../../hooks/useFetch";
import { Trash2Icon } from "lucide-react";
import { useAdminModal } from "../../../context/AdminModalContext";
import useSubmit from "../../../hooks/useSubmit";
import { useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function Admins() {
  const { data, loading, refetch } = useFetch(`/admin-auth/`);
  const { submit } = useSubmit();
  const { openModal, openConfirmationModal } = useAdminModal();

  const handleNewAdmin = async () => {
    openModal({
      url: "/admin-auth/create",
      refreshFunction: refetch,
      initialData: { email: "", password: "" },
      title: "Create admin",
    });
  };

  const handleDeleteAdmin = async (id) => {
    const response = await submit({
      url: `/admin-auth/${id}`,
      method: "DELETE",
    });

    if (!response) {
      return;
    }
    refetch();
  };

  return (
    <section className="admin-section">
      <h1 className="title secondary">Administrators</h1>
      <div className="admin-container">
        {data ? (
          data.map((admin) => (
            <div
              className="card row"
              style={{ justifyContent: "space-between", alignItems: "center" }}
              key={admin.id}
            >
              <div>
                <p>
                  <strong>E-mail:</strong> {admin.email}
                </p>
                <p>
                  <strong>Role:</strong> {admin.role}
                </p>
                <p>
                  <strong>Created by:</strong>{" "}
                  {admin?.creator ? admin.creator.email : "root"}
                </p>
              </div>
              <button
                className="delete-button alt"
                onClick={() =>
                  openConfirmationModal({
                    text: "Are you sure to delete this administrator ? This action can't be undone.",
                    handleAction: () => handleDeleteAdmin(admin.id),
                  })
                }
              >
                <Trash2Icon />
              </button>
            </div>
          ))
        ) : loading ? (
          <LoadingScreen />
        ) : (
          <p>Error retreiving admins.</p>
        )}
      </div>
      <button className="button" onClick={handleNewAdmin}>
        New administrator
      </button>
    </section>
  );
}
