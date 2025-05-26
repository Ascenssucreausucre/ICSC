import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import "./Support.css";
import { ClockFading } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Support() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  dayjs.extend(relativeTime);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/conversations`, {
          withCredentials: true,
        });
        setConversations(res.data);
      } catch (error) {
        console.log(error);
        console.error(error.response.data);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="admin-section">
      <h1 className="title scondary">Support conversations</h1>
      <div className="conversations-container">
        {conversations.map((conversation) => (
          <div
            className={`conversation ${conversation.unreadByAdmin && "unread"}`}
            key={conversation.id}
            onClick={() => navigate(`./${conversation.id}`)}
          >
            <div className="div-icon">
              {conversation.user.name.charAt(0) +
                conversation.user.surname.charAt(0)}
            </div>
            <div className="conversation-content">
              <h2 className="card-title">{`${conversation.user.name} ${conversation.user.surname}`}</h2>
              <p className="message-content">
                {conversation.messages[0].content}
              </p>
              <p>Contact: {conversation.user.email}</p>
            </div>
            <div className="conversation-date">
              <ClockFading />
              <p>{dayjs(conversation.lastMessageAt).fromNow()}</p>
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </section>
  );
}
