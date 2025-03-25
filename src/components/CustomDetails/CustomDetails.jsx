import { useState, useEffect, useRef } from "react";
import "./CustomDetails.css";

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
    <div className="details-container">
      <div
        className="summary"
        ref={summaryRef} // Associe la référence à .summary
        onClick={() => setIsOpen(!isOpen)} // Ouvre/ferme au clic
      >
        <span className="icon">{isOpen ? "▼" : "▶"}</span>
        {title}
      </div>
      {isOpen && (
        <div ref={contentRef} className="content">
          <ul>
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDetails;
