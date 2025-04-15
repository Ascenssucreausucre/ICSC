import React, { createContext, useContext, useState, useRef } from "react";

// Crée le contexte pour le feedback
const FeedbackContext = createContext();

// Fournisseur du contexte
export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState(null);
  const timeoutRef = useRef(null); // Stocke l'ID du timeout

  // Fonction pour afficher un message de feedback
  const showFeedback = (type, message) => {
    // Annule le timeout précédent s'il existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Affiche le feedback
    setFeedback(null); // Force la réinitialisation de l'état
    setTimeout(() => {
      setFeedback({ type, message });
    }, 10); // Petit délai pour réinitialiser l'animation

    // Définir un nouveau timeout pour masquer le message
    timeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  return (
    <FeedbackContext.Provider value={{ feedback, showFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Hook pour utiliser le contexte dans n'importe quel composant
export const useFeedback = () => useContext(FeedbackContext);
