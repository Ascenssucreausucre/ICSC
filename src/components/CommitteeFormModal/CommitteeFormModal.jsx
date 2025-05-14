import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../Input/Input";
import { useFeedback } from "../../context/FeedbackContext";
import { useAdminModal } from "../../context/AdminModalContext";
import useSubmit from "../../hooks/useSubmit";
import { Trash2, CirclePlus } from "lucide-react";
import "./CommitteeFormModal.css";
import AdminCommitteeMembersList from "../AdminCommitteeMembersList/AdminCommitteeMembersList";

export default function CommitteeFormModal() {
  const { detailedModalData, closeDetailedModal } = useAdminModal();
  const { submit, submitLoading } = useSubmit();
  const { showFeedback } = useFeedback();

  const [formData, setFormData] = useState({});
  const [members, setMembers] = useState([]);
  const [openMembersList, setOpenMembersList] = useState(false);

  useEffect(() => {
    if (detailedModalData?.initialData) {
      setFormData(detailedModalData.initialData);
      setMembers(detailedModalData.initialData.members || []);
    }
  }, [detailedModalData]);

  if (!detailedModalData) return null;

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const addMember = (arg) => {
    arg
      ? setMembers([...members, { ...arg, CommitteeRole: { title: "" } }])
      : setMembers([
          ...members,
          {
            name: "",
            surname: "",
            affiliation: "",
            CommitteeRole: { title: "" },
          },
        ]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const initialCommittee = detailedModalData?.initialData || {};
    const initialMembers = initialCommittee.members || [];

    let committeeResponse = null;

    // 🏗️ Création ou mise à jour du comité
    committeeResponse = await submit({
      url: formData.id ? `/Committee/update/${formData.id}` : "/Committee",
      method: formData.id ? "PUT" : "POST",
      data: formData,
    });

    if (!committeeResponse) return; // ⛔ stop si erreur

    const committeeId =
      (committeeResponse?.newItem && committeeResponse.newItem.id) ||
      formData.id;

    if (!committeeId) {
      showFeedback("error", "ID du comité introuvable.");
      return;
    }

    // 🔍 Comparaison membres
    const initialMemberMap = new Map(initialMembers.map((m) => [m.id, m]));
    const currentMemberMap = new Map(members.map((m) => [m.id, m]));

    const removedMembers = initialMembers.filter(
      (m) => !currentMemberMap.has(m.id)
    );
    const newMembers = members.filter(
      (m) => !m.id || !initialMemberMap.has(m.id)
    );
    const updatedMembers = members.filter(
      (m) =>
        m.id &&
        initialMemberMap.has(m.id) &&
        (m.name !== initialMemberMap.get(m.id).name ||
          m.surname !== initialMemberMap.get(m.id).surname ||
          m.affiliation !== initialMemberMap.get(m.id).affiliation)
    );
    const updatedRoles = members.filter(
      (m) =>
        m.id &&
        initialMemberMap.has(m.id) &&
        m.CommitteeRole?.title !==
          initialMemberMap.get(m.id)?.CommitteeRole?.title
    );

    // 🛑 Suppression des membres
    if (removedMembers.length > 0) {
      const removedMembersData =
        removedMembers.length === 1
          ? {
              committee_id: committeeId,
              member_id: removedMembers[0].id,
            }
          : {
              committee_id: committeeId,
              member_ids: removedMembers.map((m) => m.id),
            };

      const removeResponse = await submit({
        url:
          removedMembers.length === 1
            ? "/Committee/remove-member"
            : "/Committee/remove-members",
        method: "POST",
        data: removedMembersData,
      });

      if (!removeResponse) return;
    }

    // ➕ Ajout des nouveaux membres
    if (newMembers.length > 0) {
      const newMembersData =
        newMembers.length === 1
          ? {
              committee_id: committeeId,
              ...newMembers[0],
              title: newMembers[0].CommitteeRole?.title,
            }
          : {
              committee_id: committeeId,
              members: newMembers.map((member) => ({
                ...member,
                title: member.CommitteeRole?.title,
              })),
            };

      const addResponse = await submit({
        url:
          newMembers.length === 1
            ? "/Committee/add-member"
            : "/Committee/add-members",
        method: "POST",
        data: newMembersData,
      });

      if (!addResponse) return;
    }

    // 📝 Mise à jour des membres
    if (updatedMembers.length > 0) {
      const updateResponse = await submit({
        url:
          updatedMembers.length === 1
            ? `/Committee-member/update-member/${updatedMembers[0].id}`
            : "/Committee-member/update-members",
        method: "PUT",
        data:
          updatedMembers.length === 1
            ? updatedMembers[0]
            : { members: updatedMembers },
      });

      if (!updateResponse) return;
    }

    // 🎭 Mise à jour des rôles
    if (updatedRoles.length > 0) {
      const roleResponse = await submit({
        url:
          updatedRoles.length === 1
            ? "/Committee-member/update-role"
            : "/Committee-member/update-roles",
        method: "PUT",
        data:
          updatedRoles.length === 1
            ? {
                committee_id: committeeId,
                member_id: updatedRoles[0].id,
                title: updatedRoles[0].CommitteeRole.title,
              }
            : {
                committee_id: committeeId,
                roles: updatedRoles.map((m) => ({
                  member_id: m.id,
                  title: m.CommitteeRole.title,
                })),
              },
      });

      if (!roleResponse) return;
    }

    // ✅ Rafraîchir et fermer
    detailedModalData.refreshFunction?.(
      !detailedModalData.arg
        ? null
        : committeeResponse?.newItem
        ? { ...committeeResponse.newItem, members: members }
        : { ...formData, members: members }
    );

    closeDetailedModal();
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
        <h2 className="secondary title">
          {detailedModalData.title || "Committee Form"}
        </h2>
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
            <div className="member-container">
              {members.map((member, index) => {
                return (
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
                      <Trash2 color="#ffffff" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="button-container">
              <button
                type="button"
                className="add-button"
                onClick={() => addMember()}
              >
                <CirclePlus color="#ffffff" height={"100%"} /> New Member
              </button>
              <button
                type="button"
                className="add-button"
                onClick={() => setOpenMembersList((prev) => !prev)}
              >
                <CirclePlus color="#ffffff" height={"100%"} />{" "}
                {!openMembersList ? "Add Existing Member" : "Close"}
              </button>
              {openMembersList ? (
                <AdminCommitteeMembersList
                  close={() => setOpenMembersList(false)}
                  addMember={addMember}
                />
              ) : null}
            </div>
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
