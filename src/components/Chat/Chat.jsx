import React, { useEffect, useState } from "react";
import { Send, X, MessageCircleMore } from "lucide-react";
import socket from "../../utils/socket";
import axios from "axios";
import "./Chat.css";
import { useRef } from "react";
import { CircleUserRound } from "lucide-react";
import { Input } from "../Input/Input";
import { Ban } from "lucide-react";

export default function Chat({
  close,
  conversation = [],
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
    const { messages, id, ...status } = conversation;
    setMessages(messages || []);
    setConversationId(id);
    setConversationStatus(status);
  }, [conversation]);

  useEffect(() => {
    if (!conversationId) return;
    if (!conversation?.messages) {
      update && update();
    }

    socket.emit("joinRoom", conversationId);
    socket.on("newMessage", (message) => {
      setMessages((prev) => [message, ...prev]);
    });
    socket.on("throttlingToggled", ({ throttling }) => {
      const message = throttling
        ? "Throttling enabled, you can no longer send multiple messages within a minute."
        : "Throttling disabled, the limit of 1 message per minute has been thrown.";
      setMessages((prev) => [message, ...prev]);
    });
    socket.on("read", (status) => {
      setConversationStatus((prev) => ({ ...prev, ...status }));
    });

    return () => {
      socket.emit("leaveRoom", conversationId);
      socket.off("newMessage");
      socket.off("read");
      socket.off("throttlingToggled");
    };
  }, [conversationId]);

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!formMessage.trim() || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/conversations/send-message/${conversationId}`,
        { content: formMessage.trim() },
        { withCredentials: true }
      );
      setFormMessage("");
      if (!conversationId) {
        setConversationId(res.data.conversationId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data ||
        error.error ||
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

  const toggleThrottling = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/conversations/toggle-throttling/${conversationId}`,
        {},
        { withCredentials: true }
      );
      setConversationStatus((prev) => ({
        ...prev,
        throttling: res.data.throttling,
      }));
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Une erreur inattendue s'est produite.";
      console.error("[Message Error]", errorMessage);
      showErrorMessage(errorMessage);
    }
  };

  return (
    <>
      <div className="chat-room-header">
        <div className="chat-room-header-text">
          <h2 className="card-title secondary">{title}</h2>
          {userType !== "user" && (
            <div className="toggle-throttling">
              {" "}
              <Ban
                className={conversationStatus?.throttling ? "enabled" : ""}
              />
              <Input
                name="throttling"
                label="Toggle throttling (anti-spam) for this user."
                value={conversationStatus?.throttling}
                checked={conversationStatus?.throttling}
                onChange={toggleThrottling}
                type="checkbox"
              />{" "}
            </div>
          )}
        </div>

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
              {!group[0]?.id ? (
                <div className="message-info">
                  {group.map((info, index) => (
                    <p key={index}>{info}</p>
                  ))}
                </div>
              ) : (
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
              )}
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
