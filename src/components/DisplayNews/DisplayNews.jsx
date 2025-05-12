import { useState } from "react";
import { X as Cross, ChevronRight, ChevronLeft } from "lucide-react";
import "./DisplayNews.css";
import Linkify from "linkify-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function DisplayNews({ close, news = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countDown, setCountDown] = useState(true);
  const totalNews = news.length;

  useEffect(() => {
    setTimeout(() => {
      setCountDown(false);
    }, 2000);
  });

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? news.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === news.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderDot = (index) => (
    <button
      key={index}
      onClick={() => goToSlide(index)}
      className={`dot-indicator ${
        index === currentIndex
          ? "active"
          : index === totalNews - 1 || index === 0
          ? "edge-dot"
          : ""
      }`}
      aria-label={`Aller à l'actualité ${index + 1}`}
    />
  );

  // Si pas d'actualités, afficher un message
  if (!news.length) {
    return null;
  }

  return (
    !countDown && (
      <motion.div
        className="display-news-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{
          opacity: 0,
          scale: 0.9,
          transition: { duration: 0.2, ease: "anticipate" },
        }}
        transition={{
          duration: 0.6,
          ease: "backOut",
        }}
      >
        {/* Barre de navigation supérieure */}
        <div className="news-navigation">
          <div className="navigation-arrows">
            <button onClick={handlePrevious} className="nav-button prev-button">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNext} className="nav-button next-button">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicateurs de pagination */}
          <div className="pagination-dots">
            {news.map((_, index) => {
              // Cas 1 : on est dans les 3 premiers éléments
              if (currentIndex <= 2) {
                return index < 5 ? renderDot(index) : null;
              }

              // Cas 2 : on est dans les 3 derniers éléments
              if (currentIndex >= totalNews - 3) {
                return index >= totalNews - 5 ? renderDot(index) : null;
              }

              // Cas 3 : au milieu → afficher 2 avant et 2 après
              return Math.abs(index - currentIndex) <= 2
                ? renderDot(index)
                : null;
            })}
          </div>

          {/* Bouton de fermeture */}
          <button onClick={close} className="close-button nav-button">
            <Cross size={20} />
          </button>
        </div>

        {/* Contenu de l'actualité actuelle */}
        <div className="news-content">
          {news[currentIndex] && (
            <div className="news-item">
              <h2 className="news-title">{news[currentIndex].title}</h2>
              <p className="news-text">
                <Linkify options={{ target: "_blank" }}>
                  {news[currentIndex].content}
                </Linkify>
              </p>

              {news[currentIndex]?.file && (
                <Link
                  to={`${
                    import.meta.env.VITE_IMAGE_URL + news[currentIndex].file
                  }`}
                  className="link"
                  target="__blank"
                  style={{
                    color: "var(--tertiary-color)",
                    width: "fit-content",
                  }}
                >
                  Attached file
                  <LinkIcon
                    className="text-icon hover-icon"
                    size="1.2rem"
                    strokeWidth="2.5"
                  />
                </Link>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  );
}
