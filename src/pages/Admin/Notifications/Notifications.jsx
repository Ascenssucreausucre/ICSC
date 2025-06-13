import { useState } from "react";
import { Input } from "../../../components/Input/Input";
import "./Notifications.css";
import useSubmit from "../../../hooks/useSubmit";
import { Trash2Icon } from "lucide-react";

export default function Notifications() {
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    icon: "",
    badge: "",
    image: "",
    userType: "",
  });
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState([{ title: "", action: "", icon: "" }]);

  const handleActionChange = (index, field, value) => {
    const updated = [...actions];
    updated[index][field] = value;
    setActions(updated);
  };

  const addAction = () => {
    setActions([...actions, { title: "", action: "", icon: "" }]);
  };

  const removeAction = (index) => {
    const updated = actions.filter((_, i) => i !== index);
    setActions(updated);
  };
  const { submit } = useSubmit();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionsToSend = actions.filter((action) =>
      action.title.length > 0 && action.action.length > 0 ? action : null
    );
    setLoading(true);
    await submit({
      method: "POST",
      url: "/notifications/notify-all",
      data: {
        ...formData,
        badge: formData.badge.length > 0 ? formData.badge : null,
        icon: formData.icon.length > 0 ? formData.icon : null,
        image: formData.image.length > 0 ? formData.image : null,
        actions: actionsToSend,
      },
    });
    setLoading(false);
  };

  return (
    <section className="admin-section notification-section">
      <h1 className="title secondary">Notification sender</h1>
      <form className="notification-form" onSubmit={handleSubmit}>
        <h3>Body</h3>
        <Input
          label="Title"
          placeholder="The notification's title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          label="Content"
          placeholder="The notification details/text"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <Input
          label="Icon URL"
          placeholder="The url of the right icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          type="url"
        />
        <Input
          label="Badge URL"
          placeholder="The url of a transparent svg"
          name="badge"
          value={formData.badge}
          onChange={handleChange}
          type="url"
        />
        <Input
          label="Image URL"
          placeholder="The url of the banner of the notification"
          name="image"
          value={formData.image}
          onChange={handleChange}
          type="url"
        />
        <h3>Actions</h3>
        <div className="actions-container">
          {actions.map((act, index) => (
            <div key={index} className="action-row">
              <Input
                type="text"
                placeholder="Titre (ex: Ouvrir)"
                value={act.title}
                onChange={(e) =>
                  handleActionChange(index, "title", e.target.value)
                }
              />
              <Input
                type="text"
                placeholder="Nom interne (ex: open)"
                value={act.action}
                onChange={(e) =>
                  handleActionChange(index, "action", e.target.value)
                }
              />
              <Input
                type="url"
                placeholder="Icon (URL)"
                value={act.icon}
                onChange={(e) =>
                  handleActionChange(index, "icon", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeAction(index)}
                className="delete-button"
              >
                <Trash2Icon />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addAction} className="button small">
          + Ajouter une action
        </button>
        <div>
          <h3>Send to :</h3>
        </div>
        <div className="button-container">
          <button className="button" formAction="submit" disabled={loading}>
            {loading ? "Submitting..." : "Send the notification"}
          </button>
        </div>
      </form>
      {showPreview && (
        <div className="notification-preview">
          <div className="notification-badge">
            <img
              src={
                formData?.badge ? formData.badge : "/images/default-badge.svg"
              }
              style={{ filter: "invert(1)" }}
              alt=""
            />
          </div>

          <div className="notification-content">
            <h2 className="card-title secondary">{formData.title}</h2>
            <p className="notification-text">{formData.content}</p>
          </div>
          <img
            src={formData?.icon ? formData.icon : "/images/template128.png"}
            alt=""
            className="notification-icon"
          />
        </div>
      )}
    </section>
  );
}
