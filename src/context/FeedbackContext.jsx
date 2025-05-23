// FeedbackContext.jsx
import { createContext, useContext, useState, useRef } from "react";

const FeedbackContext = createContext();

let idCounter = 0;

export const FeedbackProvider = ({ children }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const timeoutMap = useRef({}); // { [id]: timeoutId }

  const showFeedback = (type, message) => {
    const id = idCounter++;
    const newFeedback = { id, type, message };

    // Ajoute le message à la liste
    setFeedbackList((prev) => [...prev, newFeedback]);

    // Configure un timeout pour le retirer après 3s
    const timeoutId = setTimeout(() => {
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
      delete timeoutMap.current[id];
    }, 3000);

    timeoutMap.current[id] = timeoutId;
  };

  return (
    <FeedbackContext.Provider value={{ feedbackList, showFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);
