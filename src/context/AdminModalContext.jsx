import { createContext, useContext, useState } from "react";

const AdminModalContext = createContext();

export const AdminModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState(null);
  const [detailedModalData, setDetailedModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const openDetailedModal = (data) => {
    setDetailedModalData(data);
  };
  const closeDetailedModal = (data) => {
    setDetailedModalData(null);
  };

  const [confirmationModalData, setConfirmationModalData] = useState(null);

  const openConfirmationModal = (data) => {
    setConfirmationModalData(data);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalData(null);
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
        confirmationModalData,
        openConfirmationModal,
        closeConfirmationModal,
      }}
    >
      {children}
    </AdminModalContext.Provider>
  );
};

export const useAdminModal = () => useContext(AdminModalContext);
