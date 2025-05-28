import { useEffect } from "react";
import "./ChatRoom.css";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import Chat from "../Chat/Chat";

export default function ChatRoom() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState({});

  const { isAuthenticated } = useUserAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      console.log(
        "[API] Tentative de récupération de la conversation utilisateur..."
      );
      try {
        const res = await axios.get(`${API_URL}/user/conversation`, {
          withCredentials: true,
        });
        console.log("[API] Conversation récupérée :", res.data);
        setConversation(res.data);
      } catch (error) {
        console.error(
          "[API] Erreur lors de la récupération de la conversation :",
          error.response?.data || error.message
        );
      }
    };

    if (isAuthenticated) {
      console.log(
        "[Auth] Utilisateur connecté, récupération de la conversation..."
      );
      if (isOpen) {
        fetchData();
      }
    } else {
      console.log("[Auth] Utilisateur NON connecté, aucune récupération.");
      setConversation({});
    }
  }, [isAuthenticated, isOpen]);

  return (
    <div className={`chat-room ${isOpen ? "opened" : "closed"}`}>
      {isOpen ? (
        <Chat
          close={() => setIsOpen(false)}
          conversation={conversation}
          userType="user"
          title="Conversation with the support"
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <button onClick={() => setIsOpen(true)} className="button-icon">
          <MessageCircle size={32} />
        </button>
      )}
    </div>
  );
}
