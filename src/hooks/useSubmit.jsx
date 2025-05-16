import { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";
import { useAuth } from "../context/AuthContext";

const useSubmit = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { showFeedback } = useFeedback();
  const { logout } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL;

  /**
   * @param {string} url - L'URL de l'API
   * @param {string} method - Méthode HTTP (POST, PUT, DELETE)
   * @param {Object|FormData} [data=null] - Les données à envoyer (JSON ou FormData)
   * @param {boolean} [isFormData=false] - Indique si on envoie du FormData (fichier)
   */
  const submit = async ({
    url,
    method = "POST",
    data = null,
    isFormData = false,
  }) => {
    setSubmitLoading(true);

    // console.log(baseUrl + url, data);

    try {
      const response = await fetch(baseUrl + url, {
        method,
        headers: isFormData
          ? {} // pas de Content-Type -> le navigateur ajoute automatiquement le bon (multipart/form-data avec boundary)
          : {
              "Content-Type": "application/json",
            },
        credentials: "include",
        body: data ? (isFormData ? data : JSON.stringify(data)) : null,
      });

      const responseData = await response.json();

      if (response.status === 403) {
        showFeedback("error", "Session expired. Please log-in again.");
        logout();
      }

      if (!response.ok) {
        const receivedError =
          responseData?.error || responseData?.errors[0].message;
        console.error(receivedError);
        throw new Error(receivedError || "Une erreur s'est produite");
      }

      showFeedback("success", responseData.message);
      return responseData;
    } catch (err) {
      showFeedback("error", err.message);
      console.error("Erreur API :", err);
      return null;
    } finally {
      setSubmitLoading(false);
    }
  };

  return { submit, submitLoading };
};

export default useSubmit;
