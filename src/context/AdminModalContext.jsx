import React, { createContext, useContext, useState } from "react";

// Crée le contexte pour le modal
const AdminModalContext = createContext();

// Fournisseur du contexte
export const AdminModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState(null);
  const [detailedModalData, setDetailedModalData] = useState(null);

  // Fonction pour afficher le modal avec les propriétés spécifiques
  const openModal = (data) => {
    setModalData(data);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setModalData(null);
  };

  const openDetailedModal = (data) => {
    setDetailedModalData(data);
  };
  const closeDetailedModal = (data) => {
    setDetailedModalData(null);
  };

  return (
    <AdminModalContext.Provider
      value={{
        modalData,
        detailedModalData,
        openModal,
        closeModal,
        openDetailedModal,
        closeDetailedModal,
      }}
    >
      {children}
    </AdminModalContext.Provider>
  );
};

// Hook pour utiliser le contexte dans n'importe quel composant
export const useAdminModal = () => useContext(AdminModalContext);
