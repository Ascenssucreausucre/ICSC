import { useEffect } from "react";
import socket from "../../utils/socket";
import "./ChatRoom.css";
import { useState } from "react";
import { Send } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { X } from "lucide-react";
import { MessageCircleMore } from "lucide-react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [formMessage, setFormMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState();

  const { isAuthenticated } = useUserAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("[Socket.IO] Setup listener for newMessage");
    socket.on("newMessage", (message) => {
      console.log("[Socket.IO] Nouveau message reçu :", message);
      setMessages((prev) => [message, ...prev]);
    });

    return () => {
      console.log("[Socket.IO] Cleanup listener for newMessage");
      socket.off("newMessage");
    };
  }, []);

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
        setMessages(res.data.messages);
        setConversationId(res.data.id); // <- assure-toi que c’est bien `id` et pas `conversationId`
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
      fetchData();
    } else {
      console.log("[Auth] Utilisateur NON connecté, aucune récupération.");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (conversationId) {
      console.log(
        `[Socket.IO] Tentative de rejoindre la room : ${conversationId}`
      );
      socket.emit("joinRoom", conversationId);

      return () => {
        console.log(`[Socket.IO] Quitter la room : ${conversationId}`);
        socket.emit("leaveRoom", conversationId);
        socket.off("newMessage");
      };
    } else {
      console.log("[Socket.IO] Aucun conversationId, pas de joinRoom");
    }
  }, [conversationId]);

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!formMessage.trim() || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/conversation/send-message`,
        { content: formMessage.trim() },
        { withCredentials: true }
      );
      setFormMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-room ${isOpen ? "opened" : "closed"}`}>
      {isOpen ? (
        <>
          <div className="chat-room-header">
            <p>Conversation</p>
            <button
              className="button-icon close-button"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </button>
          </div>
          <div className="chat-room-messages">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  className={`message ${message.senderType}`}
                  key={message.id}
                >
                  <p>{message.content}</p>
                </div>
              ))
            ) : isAuthenticated ? (
              <p className="data-detail">
                Your conversation with the support. To avoid spams, you will be
                able to send a message once every minutes until and support
                anwsers, so be as precise as you can in communicating us your
                needs in your first message !
              </p>
            ) : (
              <p className="data-detail">
                You have to be connected to send message to the support.
              </p>
            )}
          </div>
          <form className="chat-room-form" onSubmit={submitMessage}>
            <MessageCircleMore size="2rem" />
            <input
              type="text"
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              placeholder="Your message..."
              disabled={!isAuthenticated}
            />
            <button
              className="button-icon send-button"
              disabled={isLoading || !isAuthenticated}
            >
              <Send />
            </button>
          </form>
        </>
      ) : (
        <button onClick={() => setIsOpen(true)} className="button-icon">
          <MessageCircle />
        </button>
      )}
    </div>
  );
}
