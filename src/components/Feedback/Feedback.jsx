import { useFeedback } from "../../context/FeedbackContext";
import { motion, AnimatePresence } from "framer-motion";
import "./Feedback.css";
import { CrossIcon } from "lucide-react";
import { CheckCircle2Icon } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";
export function Feedback() {
  const { feedback } = useFeedback();

  return (
    <AnimatePresence>
      {" "}
      {/* Ajoute mode="wait" pour éviter les conflits */}
      {feedback && (
        <motion.div
          key={feedback.id} // Clé unique pour réinitialiser l'animation
          className={`${feedback.type} status-feedback`}
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ duration: 0.2 }}
          style={{ position: "fixed", left: "50%" }}
        >
          {feedback.type === "success" ? (
            <CheckCircle style={{ marginRight: "10px", height: "100%" }} />
          ) : (
            <XCircle style={{ marginRight: "10px", height: "100%" }} />
          )}
          <p>
            <strong>
              {String(feedback.type).charAt(0).toUpperCase() +
                String(feedback.type).slice(1)}{" "}
            </strong>
            {feedback.message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
