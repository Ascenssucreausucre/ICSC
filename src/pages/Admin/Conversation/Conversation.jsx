import axios from "axios";
import { Send, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./Conversation.css";

export default function Conversation() {
  const { id: conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [formMessage, setFormMessage] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/conversations/${conversationId}`,
          { withCredentials: true }
        );
        console.log(res);
        setMessages(res.data.messages);
        setUser(res.data.user.name + " " + res.data.user.surname);
      } catch (error) {
        console.error(error.response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="conversation-modal"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="conversation-modal-header">
          <h2>Discussion with {user}</h2>
          <button className="button-icon">
            <X />
          </button>
        </div>
        <div className="conversation-modal-messages">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div>
                <p>{message.content}</p>
              </div>
            ))
          ) : (
            <p>No message found in this conversation.</p>
          )}
        </div>
        <form>
          <input
            type="text"
            value={formMessage}
            onChange={(e) => setFormMessage(e.target.value)}
            placeholder="Your message..."
          />
          <Send />
        </form>
      </motion.div>
    </motion.div>
  );
}
