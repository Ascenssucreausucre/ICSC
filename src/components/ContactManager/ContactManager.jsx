import { Phone } from "lucide-react";
import { useAdminModal } from "../../context/AdminModalContext";
import useSubmit from "../../hooks/useSubmit";
import { Mail } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import "./ContactManager.css";

export default function ContactManager({ contacts, conference_id, refetch }) {
  const { openModal } = useAdminModal();
  const { submit } = useSubmit();
  const [confirmation, setConfirmation] = useState(null);
  const initialData = {
    name: "",
    surname: "",
    email: "",
    tel: "",
    title: "",
    conference_id,
  };

  const handleCreateContact = async () => {
    openModal({
      url: `/contact`,
      method: "POST",
      initialData,
      title: "Create a contact",
      refreshFunction: refetch,
    });
  };
  const handleUpdateContact = async (contact) => {
    openModal({
      url: `/contact/${contact.id}`,
      method: "PUT",
      title: `Update contact ${contact.name + " " + contact.surname}`,
      initialData: contact,
      refreshFunction: refetch,
    });
  };
  const handleDeleteContact = async (id) => {
    await submit({
      url: `/contact/${id}`,
      method: "DELETE",
    });
  };
  return (
    <section className="admin-section">
      {confirmation && (
        <ConfirmationModal
          handleAction={() => handleDeleteContact(confirmation)}
          text="Are you sure to delete this contact ?"
          unShow={() => setConfirmation(null)}
        />
      )}
      <h2 className="secondary title">Contacts</h2>
      {contacts?.length > 0 ? (
        contacts.map((contact) => (
          <div className="card contact-card">
            <h3 className="card-title">
              {contact.name + " " + contact.surname}
            </h3>
            <p>
              {contact?.role ? (
                <strong>{contact.role}</strong>
              ) : (
                <p className="data-detail">This contact has no role.</p>
              )}
            </p>
            <p>
              <strong>
                <Phone />
                Phone Number:{" "}
              </strong>{" "}
              {contact.tel}
            </p>
            <p>
              <strong>
                <Mail />
                E-Mail adress:{" "}
              </strong>{" "}
              {contact.email}
            </p>
            <div className="button-container">
              <button
                className="button"
                onClick={() => handleUpdateContact(contact)}
              >
                Edit
              </button>
              <button className="button">Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>This conference has no contact yet.</p>
      )}
      <div className="button-container">
        <button className="button" onClick={handleCreateContact}>
          Add contact
        </button>
      </div>
    </section>
  );
}
