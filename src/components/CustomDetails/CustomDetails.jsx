import { useState, useEffect, useRef } from "react";
import "./CustomDetails.css";
import { Triangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CustomDetails = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null); // Référence à l'élément content
  const summaryRef = useRef(null); // Référence à l'élément summary

  // Fonction pour fermer le contenu si on clique en dehors
  const handleClickOutside = (event) => {
    // Si le clic n'est ni sur .content ni sur .summary, on ferme le contenu
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target) &&
      summaryRef.current &&
      !summaryRef.current.contains(event.target)
    ) {
      setIsOpen(false); // Ferme le contenu
    }
  };

  // Ajout de l'écouteur d'événements quand le composant est monté
  useEffect(() => {
    if (isOpen) {
      // Ajoute l'écouteur de clic à l'extérieur si le contenu est ouvert
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Retire l'écouteur de clic à l'extérieur si le contenu est fermé
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Nettoyage de l'événement lorsqu'on quitte le composant
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // On ne met à jour l'effet que si isOpen change

  return (
    <div
      className="details-container"
      ref={summaryRef} // Associe la référence à .summary
      onClick={() => setIsOpen(!isOpen)} // Ouvre/ferme au clic
    >
      <div className="summary">
        <span className={`icon${isOpen ? " active" : ""}`}>
          <Triangle
            size={"1rem"}
            color="white"
            // strokeWidth="5px"
            fill="white"
          />
        </span>
        {title}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            className="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <motion.ul initial="hidden" animate="visible" exit="hidden">
              {content.map((item, index) => (
                <motion.li
                  key={index}
                  variants={{
                    hidden: { opacity: 0, paddingBlock: "0.4rem" },
                    visible: { opacity: 1, paddingBlock: "0.5rem" },
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {item.text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDetails;
