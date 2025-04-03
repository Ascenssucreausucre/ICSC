import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../Input/Input";
import { useFeedback } from "../../context/FeedbackContext";
import { useAdminModal } from "../../context/AdminModalContext";
import useSubmit from "../../hooks/useSubmit";
import "./CommitteeFormModal.css";

export default function CommitteeFormModal() {
  const { detailedModalData, closeDetailedModal } = useAdminModal();
  const { submit, submitLoading } = useSubmit();
  const { showFeedback } = useFeedback();

  const [formData, setFormData] = useState({});
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (detailedModalData?.initialData) {
      setFormData({
        id: detailedModalData.initialData.id || null,
        type: detailedModalData.initialData.type || "",
        conference_id: detailedModalData.initialData.conference_id || "",
      });
      setMembers(detailedModalData.initialData.members || []);
    } else {
      setFormData({ type: "", conference_id: "" });
      setMembers([]);
    }
  }, [detailedModalData]);

  if (!detailedModalData) return null;

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([
      ...members,
      { name: "", surname: "", affiliation: "", CommitteeRole: { title: "" } },
    ]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const committeeResponse = formData.id
        ? await submit({
            url: `/Committee/${formData.id}`,
            method: "PUT",
            data: formData,
          })
        : await submit({ url: "/Committee", method: "POST", data: formData });

      if (!formData.id && committeeResponse?.id) {
        for (const member of members) {
          await submit({
            url: "/Committee-member",
            method: "POST",
            data: { ...member, committee_id: committeeResponse.id },
          });
        }
      }

      detailedModalData.refreshFunction?.();
      closeDetailedModal();
      showFeedback("Committee saved successfully", "success");
    } catch {
      showFeedback("Failed to save committee", "error");
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="committee-form"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="secondary">
          {detailedModalData.title || "Committee Form"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <Input
              name="type"
              value={formData.type || ""}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              placeholder="Committee Type"
              label="Committee Type"
              required
            />
          </div>

          <div className="form-section">
            <h2>Members</h2>
            {members.map((member, index) => (
              <div key={index} className="member-row">
                <Input
                  name="name"
                  value={member.name}
                  onChange={(e) =>
                    handleMemberChange(index, "name", e.target.value)
                  }
                  placeholder="Name"
                />
                <Input
                  name="surname"
                  value={member.surname}
                  onChange={(e) =>
                    handleMemberChange(index, "surname", e.target.value)
                  }
                  placeholder="Surname"
                />
                <Input
                  name="affiliation"
                  value={member.affiliation}
                  onChange={(e) =>
                    handleMemberChange(index, "affiliation", e.target.value)
                  }
                  placeholder="Affiliation"
                />
                <Input
                  name="role"
                  value={member.CommitteeRole.title}
                  onChange={(e) =>
                    handleMemberChange(index, "CommitteeRole", {
                      title: e.target.value,
                    })
                  }
                  placeholder="Role"
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeMember(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="add-button" onClick={addMember}>
              + Add Member
            </button>
          </div>

          <div className="button-container">
            <button type="submit" className="button" disabled={submitLoading}>
              {submitLoading
                ? "Processing..."
                : formData.id
                ? "Update Committee"
                : "Create Committee"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={closeDetailedModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
