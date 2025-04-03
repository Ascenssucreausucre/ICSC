import { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";

const useSubmit = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { showFeedback } = useFeedback();
  const baseUrl = import.meta.env.VITE_API_URL;

  /**
   * @param {string} url - L'URL de l'API
   * @param {string} method - Méthode HTTP (POST, PUT, DELETE)
   * @param {Object} [data=null] - Les données à envoyer (pour POST/PUT)
   */
  const submit = async ({ url, method = "POST", data = null }) => {
    setSubmitLoading(true);

    try {
      const response = await fetch(baseUrl + url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: data ? JSON.stringify(data) : null, // Body seulement si `data` existe
      });

      console.log(baseUrl + url);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || "Une erreur s'est produite");
      }

      showFeedback("success", responseData.message);
      return responseData; // Retourne la réponse pour une utilisation future
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
