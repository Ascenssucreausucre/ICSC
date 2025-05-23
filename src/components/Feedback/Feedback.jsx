// Feedback.jsx
import { useFeedback } from "../../context/FeedbackContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import "./Feedback.css";

export function Feedback() {
  const { feedbackList } = useFeedback();

  return (
    <div className="feedback-container">
      <AnimatePresence>
        {feedbackList.map((feedback) => (
          <motion.div
            key={feedback.id}
            className={`${feedback.type} status-feedback`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            layout="position"
          >
            {feedback.type === "success" ? (
              <CheckCircle style={{ marginRight: "10px" }} />
            ) : (
              <XCircle style={{ marginRight: "10px" }} />
            )}
            <p>
              <strong>
                {String(feedback.type).charAt(0).toUpperCase() +
                  String(feedback.type).slice(1)}{" "}
              </strong>
              {feedback.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
