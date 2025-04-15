import { useFeedback } from "../../context/FeedbackContext";
import { motion, AnimatePresence } from "framer-motion";
import "./Feedback.css";
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
          <p>{feedback.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
