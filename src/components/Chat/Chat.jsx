import React, { useEffect, useState } from "react";
import { Send, X, MessageCircleMore } from "lucide-react";
import socket from "../../utils/socket";
import axios from "axios";
import "./Chat.css";
import { useFeedback } from "../../context/FeedbackContext";
import { status } from "nprogress";
import { CheckCheck } from "lucide-react";
import { useRef } from "react";
import { CircleUserRound } from "lucide-react";

export default function Chat({
  close,
  conversation,
  userType = "user",
  title = "Conversation",
  update,
  isAuthenticated = false,
}) {
  const [messages, setMessages] = useState([]);
  const [formMessage, setFormMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversationStatus, setConversationStatus] = useState(null);
  const [displayError, setDisplayError] = useState(null);

  const errorTimeout = useRef(null);

  const showErrorMessage = (message) => {
    setDisplayError(message);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => {
      setDisplayError(null);
    }, 5000);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const user = conversation?.user;

  useEffect(() => {
    if (!conversation) return;
    console.log("Updating conversation...");
    const { messages, id, ...status } = conversation;
    setMessages(messages || []);
    setConversationId(id);
    setConversationStatus(status);
  }, [conversation]);

  useEffect(() => {
    if (!conversationId) return;
    if (conversation?.length < 1 || !conversation) {
      update();
    }

    socket.emit("joinRoom", conversationId);
    socket.on("newMessage", (message) => {
      setMessages((prev) => [message, ...prev]);
    });
    socket.on("read", (status) => {
      setConversationStatus((prev) => ({ ...prev, ...status }));
    });

    return () => {
      socket.emit("leaveRoom", conversationId);
      socket.off("newMessage");
      socket.off("read");
    };
  }, [conversationId]);

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!formMessage.trim() || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/conversation/send-message/${conversationId}`,
        { content: formMessage.trim() },
        { withCredentials: true }
      );
      setFormMessage("");
      if (!conversationId) {
        console.log("Setting up conversation...");
        setConversationId(res.data.conversationId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Une erreur inattendue s’est produite.";
      console.error("[Message Error]", errorMessage);
      showErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Grouped messages by senderType
  const groupedMessages = messages.reduce((acc, message) => {
    const lastGroup = acc[acc.length - 1];

    if (!lastGroup || lastGroup[0].senderType !== message.senderType) {
      acc.push([message]);
    } else {
      lastGroup.push(message);
    }

    return acc;
  }, []);

  return (
    <>
      <div className="chat-room-header">
        <h2 className="card-title secondary">{title}</h2>
        {close && (
          <button className="button-icon close-button" onClick={close}>
            <X />
          </button>
        )}
      </div>

      <div className={`chat-room-messages ${userType}`}>
        {groupedMessages.length > 0 ? (
          groupedMessages.map((group, index) => (
            <React.Fragment key={index}>
              <div
                className={`messages-group${
                  group[0].senderType === userType ? " current-user" : ""
                }`}
              >
                {group[0].senderType !== userType && (
                  <div className="div-icon">
                    {user?.name ? (
                      user?.name?.charAt(0) + user?.surname?.charAt(0)
                    ) : (
                      <CircleUserRound />
                    )}
                  </div>
                )}
                <div className="messages">
                  {group.map((message) => {
                    const msgDate = new Date(message.createdAt);
                    const padZero = (num) => (num < 10 ? "0" + num : num);
                    const hourValue =
                      padZero(msgDate.getHours()) +
                      ":" +
                      padZero(msgDate.getMinutes());

                    return (
                      <div key={message.id} className="message">
                        <p>{message.content}</p>
                        <p className="message-time">{hourValue}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* {index === 0 && group[0].senderType === userType && (
                <CheckCheck />
              )} */}
              {/* {console.log(groupedMessages.length === index + 1, {
                senderType: group[0].senderType,
                userType,
              })} */}
            </React.Fragment>
          ))
        ) : isAuthenticated ? (
          <p className="data-detail">
            Your conversation with support. Be as precise as possible in your
            first message.
          </p>
        ) : (
          <p className="data-detail">
            You have to be connected to send messages to the support.
          </p>
        )}
      </div>

      <form className="chat-room-form" onSubmit={submitMessage}>
        {displayError && <div className="display-error">{displayError}</div>}
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
  );
}
