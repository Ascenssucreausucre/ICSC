import { useState, useEffect } from "react";
import { useAdminModal } from "../../context/AdminModalContext";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import useSubmit from "../../hooks/useSubmit";
import TopicsFormModal from "../TopicsFormModal/TopicsFormModal";

export default function TopicManager({ data, conference_id }) {
  const { submit } = useSubmit();
  const [confirmation, setConfirmation] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openTopicModal, setOpenTopicModal] = useState(false);

  useEffect(() => {
    if (data) setTopics(data);
  }, [data]);

  // Fonction de suppression du topic
  const handleDeleteTopic = () => {
    if (selectedTopic) {
      submit({ url: `/Topics/delete/${selectedTopic.id}`, method: "DELETE" });
      setTopics((prev) => prev.filter((item) => item.id !== selectedTopic.id)); // Supprimer le topic de la liste
      setSelectedTopic(null); // Réinitialiser le topic sélectionné après suppression
    }
  };

  // Fonction pour gérer l'ouverture du modal de confirmation et sélectionner un topic à supprimer
  const handleOpenConfirmationModal = (topic) => {
    setSelectedTopic(topic);
    setConfirmation(true); // Ouvrir le modal de confirmation
  };

  const handleManageTopic = (topic) => {
    setSelectedTopic(topic);
    setOpenTopicModal(true);
  };

  const handleRefreshTopics = (topic) => {
    const targetedTopic = topics.find((t) => t.id === topic.id);
    if (!targetedTopic) {
      setTopics([...topics, topic]);
    } else {
      setTopics((prev) => {
        return prev.map((t) => {
          if (t.id === topic.id) {
            return topic;
          } else {
            return t;
          }
        });
      });
    }
  };

  return (
    <div className="topic-manager  admin-section">
      {confirmation && selectedTopic ? (
        <ConfirmationModal
          handleAction={handleDeleteTopic} // Passer la fonction de suppression
          text={`Are you sure you want to delete ${selectedTopic.title} ?`} // Utiliser les informations du topic sélectionné
          textAction={"Delete"}
          unShow={setConfirmation} // Fermer le modal
        />
      ) : null}

      {openTopicModal ? (
        <TopicsFormModal
          data={selectedTopic}
          close={() => setOpenTopicModal(false)}
          refreshFunction={handleRefreshTopics}
          conference_id={conference_id}
        />
      ) : null}

      <h2 className="title secondary">Topics</h2>
      <div className="card-container">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="card committee-back-container flex-1"
            >
              <div className="card-data flex-1">
                <h2 className="secondary">{topic.title}</h2>
                <p>
                  This topic has {topic.content.length}{" "}
                  {topic.content.length > 1 ? "subtopics" : "subtopic"}
                </p>
              </div>
              <div className="button-container">
                <button
                  className="button small"
                  onClick={() => handleManageTopic(topic)}
                >
                  Manage
                </button>
                <button
                  className="button small"
                  onClick={() => handleOpenConfirmationModal(topic)} // Lors du clic, ouvrir le modal avec le topic
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>This conference has no topics yet.</p>
        )}
      </div>
      <button className="button" onClick={() => handleManageTopic(null)}>
        New topic
      </button>
    </div>
  );
}
