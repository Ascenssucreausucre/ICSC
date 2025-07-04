import { useEffect } from "react";
import "./ChatRoom.css";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import Chat from "../Chat/Chat";

export default function ChatRoom() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);

  const { isAuthenticated } = useUserAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/conversations/user`, {
        withCredentials: true,
      });
      setConversation(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (isOpen) {
        fetchData();
      }
    } else {
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
          update={fetchData}
        />
      ) : (
        <button onClick={() => setIsOpen(true)} className="button-icon">
          <MessageCircle size={32} />
        </button>
      )}
    </div>
  );
}
