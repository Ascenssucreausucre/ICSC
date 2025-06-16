import axios from "axios";
import { Send, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./Conversation.css";
import Chat from "../../../components/Chat/Chat";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function Conversation() {
  const { id: conversationId } = useParams();

  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/conversations/${conversationId}`,
          { withCredentials: true }
        );
        setConversation(res.data);
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
        {!loading ? (
          <Chat
            close={() => navigate("../")}
            conversation={conversation}
            userType="admin"
            isAuthenticated={true}
            title={`Conversation with ${conversation?.user.name} ${conversation?.user.surname}`}
          />
        ) : (
          <LoadingScreen />
        )}
      </motion.div>
    </motion.div>
  );
}
