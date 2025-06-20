import { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";
import { useAuth } from "../context/AuthContext";

const useSubmit = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { showFeedback } = useFeedback();
  const { logout } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL;

  /**
   * @param {string} url - The API URL
   * @param {string} method - HTTP method (POST, PUT, DELETE)
   * @param {Object|FormData} [data=null] - Data to send (JSON or FormData)
   * @param {boolean} [isFormData=false] - Indicates whether FormData (e.g. file upload) is being sent
   */

  const submit = async ({
    url,
    method = "POST",
    data = null,
    isFormData = false,
  }) => {
    setSubmitLoading(true);

    try {
      const response = await fetch(baseUrl + url, {
        method,
        headers: isFormData
          ? {}
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
        throw new Error(receivedError || "An error has occurred.");
      }

      showFeedback("success", responseData.message);
      return responseData;
    } catch (err) {
      showFeedback("error", err.message);
      console.error("Internal server error :", err);
      return null;
    } finally {
      setSubmitLoading(false);
    }
  };

  return { submit, submitLoading };
};

export default useSubmit;
