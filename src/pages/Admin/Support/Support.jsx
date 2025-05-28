import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect, useCallback, useRef } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import "./Support.css";
import { ClockFading } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Archive } from "lucide-react";
import useSubmit from "../../../hooks/useSubmit";
import { ArchiveRestore } from "lucide-react";
import Pagination from "../../../components/Pagination/Pagination";
import { Input } from "../../../components/Input/Input";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import socket from "../../../utils/socket";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { Trash2Icon } from "lucide-react";

export default function Support() {
  const API_URL = import.meta.env.VITE_API_URL;
  dayjs.extend(relativeTime);

  const [conversations, setConversations] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [filters, setFilters] = useState({
    showArchived: false,
    onlyUnread: false,
    page: 1,
    limit: 20,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [archivingIds, setArchivingIds] = useState(new Set()); // Track archiving operations
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  // Utilise useRef pour avoir toujours les filtres actuels dans les callbacks
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Fonction pour vérifier si une conversation correspond aux filtres
  const matchesFilters = useCallback(
    (conversation, currentFilters = filtersRef.current) => {
      const { showArchived, onlyUnread } = currentFilters;

      const archiveMatch = showArchived
        ? conversation.archived === true
        : conversation.archived === false;

      const unreadMatch = onlyUnread
        ? conversation.unreadByAdmin === true
        : true;

      return archiveMatch && unreadMatch;
    },
    []
  );

  useEffect(() => {
    console.log("[Socket.IO] Join adminRoom");
    socket.emit("joinRoom", "adminRoom");

    const handleConversationUpdate = ({
      type,
      data: updatedConversation,
      id: convId,
    }) => {
      console.log(
        "[Socket.IO] conversationUpdated:",
        type,
        updatedConversation
      );

      setConversations((prev) => {
        let updatedList;

        if (type === "newMessage") {
          // Supprime si existe déjà
          updatedList = prev.filter(
            (conv) => conv.id !== updatedConversation.id
          );

          // Vérifie si la conversation correspond aux filtres avant de l'ajouter
          if (matchesFilters(updatedConversation)) {
            updatedList.push(updatedConversation);
          }

          // Trie par date
          updatedList.sort(
            (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
          );

          // Limite à la taille de page
          if (updatedList.length > filtersRef.current.limit) {
            updatedList = updatedList.slice(0, filtersRef.current.limit);
          }
        } else {
          // Pour les autres types de mise à jour (comme l'archivage)
          const existingIndex = prev.findIndex((conv) => conv.id === convId);

          if (existingIndex !== -1) {
            const updatedConv = {
              ...prev[existingIndex],
              ...updatedConversation,
            };

            // Si la conversation correspond toujours aux filtres, la mettre à jour
            if (matchesFilters(updatedConv)) {
              updatedList = [
                ...prev.slice(0, existingIndex),
                updatedConv,
                ...prev.slice(existingIndex + 1),
              ];
            } else {
              // Sinon, la retirer de la liste
              updatedList = prev.filter((conv) => conv.id !== convId);
            }
          } else {
            // La conversation n'existe pas dans la liste actuelle
            if (matchesFilters(updatedConversation)) {
              updatedList = [...prev, updatedConversation];
              updatedList.sort(
                (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
              );
            } else {
              updatedList = prev;
            }
          }
        }

        return updatedList;
      });
    };

    socket.on("conversationUpdated", handleConversationUpdate);

    return () => {
      console.log("[Socket.IO] Leave adminRoom");
      socket.emit("leaveRoom", "adminRoom");
      socket.off("conversationUpdated", handleConversationUpdate);
    };
  }, [matchesFilters]);

  const { submit } = useSubmit();

  const handleArchive = async (id) => {
    try {
      // Marquer comme en cours d'archivage
      setArchivingIds((prev) => new Set([...prev, id]));

      console.log(`🔄 Archiving conversation ${id}...`);

      const res = await submit({
        url: `/conversation/archive/${id}`,
        method: "PUT",
      });

      if (res) {
        console.log(`✅ Conversation ${id} archived successfully`);

        // Mise à jour optimiste locale (en cas de problème WebSocket)
        setConversations((prev) => {
          return prev
            .map((conv) => {
              if (conv.id === id) {
                const updatedConv = { ...conv, archived: !conv.archived };
                // Si la conversation ne correspond plus aux filtres, elle sera supprimée
                return matchesFilters(updatedConv) ? updatedConv : null;
              }
              return conv;
            })
            .filter(Boolean);
        });

        // Si on affiche les conversations archivées et qu'on vient d'archiver,
        // ou si on n'affiche pas les archivées et qu'on vient de désarchiver,
        // on peut forcer un refresh pour être sûr
        if (
          (filters.showArchived &&
            !conversations.find((c) => c.id === id)?.archived) ||
          (!filters.showArchived &&
            conversations.find((c) => c.id === id)?.archived)
        ) {
          setTimeout(() => setRefreshFlag((prev) => !prev), 500);
        }
      } else {
        console.error(`❌ Failed to archive conversation ${id}`);
      }
    } catch (error) {
      console.error(`❌ Error archiving conversation ${id}:`, error);
    } finally {
      // Retirer de la liste d'archivage
      setArchivingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const fetchAdminConversations = async ({
    showArchived = false,
    onlyUnread = false,
    page = 1,
    limit = 20,
  }) => {
    const params = {
      showArchived,
      onlyUnread,
      page,
      limit,
    };

    const res = await axios.get(`${API_URL}/conversations`, {
      params,
      withCredentials: true,
    });

    return res.data;
  };

  const fetchData = async () => {
    try {
      console.log("🔄 Fetching conversations with filters:", filters);
      const res = await fetchAdminConversations(filters);
      setIsLoading(false);
      setConversations(res.results);
      setFilters((prev) => ({ ...prev, totalItems: res.total }));
      console.log("✅ Conversations loaded:", res.results.length);
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);
      console.error(error?.response?.data || error.message);
      setIsLoading(false);
    }
  };

  const handleDeleteConv = async (id) => {
    const res = await submit({
      url: `/conversations/${id}`,
      method: "DELETE",
    });
    if (!res) {
      return;
    }
    setRefreshFlag((prev) => !prev);
  };

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [
    refreshFlag,
    filters.showArchived,
    filters.onlyUnread,
    filters.page,
    filters.limit,
  ]);

  return (
    <section className="admin-section support-section">
      {confirmation && (
        <ConfirmationModal
          handleAction={() => handleDeleteConv(confirmation)}
          text="Are you sure to delete this conversation ? This action is ireversible."
          unShow={() => setConfirmation(null)}
        />
      )}
      <h1 className="title scondary">Support conversations</h1>
      <div className="filters">
        <Input
          type="checkbox"
          label="Show archived"
          checked={filters.showArchived}
          name="showArchived"
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              showArchived: e.target.checked,
              page: 1,
            }));
          }}
        />
        <Input
          type="checkbox"
          label="Show only unread"
          name="onlyUnread"
          checked={filters.onlyUnread}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              onlyUnread: e.target.checked,
              page: 1,
            }));
          }}
        />
      </div>
      <div className="conversations-container">
        {!isLoading ? (
          conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div className="conversation-wrapper" key={conversation.id}>
                <div
                  className={`conversation ${
                    conversation.unreadByAdmin && "unread"
                  }`}
                  onClick={() => navigate(`./${conversation.id}`)}
                >
                  <div className="div-icon">
                    {conversation.user.name.charAt(0) +
                      conversation.user.surname.charAt(0)}
                  </div>
                  <div className="conversation-content">
                    <h2 className="card-title">{`${conversation.user.name} ${conversation.user.surname}`}</h2>
                    <p className="message-content">
                      {conversation.messages[0].senderType === "admin"
                        ? "Admin: " + conversation.messages[0].content
                        : "" + conversation.messages[0].content}
                    </p>
                    <p>E-mail: {conversation.user.email}</p>
                  </div>
                  <div className="conversation-date">
                    <ClockFading />
                    <p>{dayjs(conversation.lastMessageAt).fromNow()}</p>
                  </div>
                </div>
                <div className="conversation-actions">
                  <button
                    className={`button-icon ${
                      archivingIds.has(conversation.id) ? "loading" : ""
                    }`}
                    aria-description={
                      conversation.archived
                        ? "Restore the conversation"
                        : "Archive the conversation"
                    }
                    onClick={() => handleArchive(conversation.id)}
                    disabled={archivingIds.has(conversation.id)}
                  >
                    {archivingIds.has(conversation.id) ? (
                      <ClockFading className="spinning" />
                    ) : conversation.archived ? (
                      <ArchiveRestore />
                    ) : (
                      <Archive />
                    )}
                  </button>
                  <button
                    className="button-icon"
                    aria-description="Delete conversation"
                    onClick={() => setConfirmation(conversation.id)}
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No conversation found</p>
          )
        ) : (
          <LoadingScreen />
        )}
      </div>
      <Pagination
        totalItems={filters.totalItems}
        itemsPerPage={filters.limit}
        currentPage={filters.page}
        onPageChange={(i) => setFilters((prev) => ({ ...prev, page: i }))}
      />
      <Outlet />
    </section>
  );
}
