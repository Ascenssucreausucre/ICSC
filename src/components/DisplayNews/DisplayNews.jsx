import { useState, useEffect } from "react";
import { X as Cross, ChevronRight, ChevronLeft } from "lucide-react";
import "./DisplayNews.css";
import Linkify from "linkify-react";
import { motion } from "framer-motion";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  subscribeUserToPush,
  getNotificationPermissionStatus,
  checkPushSubscription,
  isAppleDevice,
  isRunningAsPWA,
} from "../../utils/pushNotification";
import { Bell } from "lucide-react";
import { Smartphone } from "lucide-react";
import { usePWAInstall } from "../../context/InstallPWAContext";

export default function DisplayNews({ close, news = [], vapidPublicKey }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countDown, setCountDown] = useState(true);
  const [permission, setPermission] = useState(
    getNotificationPermissionStatus()
  );
  const [pushSubscription, setPushSubscription] = useState(null);
  const totalNews = news.length;
  const { deferredPrompt, isInstalled, handleInstallClick } = usePWAInstall();

  const showInstallButton = !isInstalled && deferredPrompt;

  // Vérification de l'abonnement aux notifications
  useEffect(() => {
    const checkExistingSubscription = async () => {
      const subscription = await checkPushSubscription();
      setPushSubscription(subscription);
    };

    checkExistingSubscription();
  }, []);

  // Gestion des notifications push
  const handleAskPermission = async () => {
    if (isAppleDevice() && !isRunningAsPWA()) {
      alert(
        "Push notifications are only available on iOS when the app is installed on your home screen."
      );
      return;
    }
    try {
      const subscription = await subscribeUserToPush(
        vapidPublicKey,
        `${import.meta.env.VITE_API_URL}/notifications/subscribe`
      );

      // Mise à jour de l'état des permissions et de l'abonnement
      setPermission(getNotificationPermissionStatus());
      setPushSubscription(subscription);
    } catch (error) {
      console.error("Erreur lors de l'activation des notifications:", error);
    }
  };

  // Countdown pour l'affichage initial
  useEffect(() => {
    setTimeout(() => {
      setCountDown(false);
    }, 2000);
  }, []);

  // Navigation dans les actualités
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

  // Si pas d'actualités, ne rien afficher
  if (!news.length) {
    return null;
  }

  // Vérifie si nous devons afficher des CTA pour PWA ou notifications
  const showNotificationButton =
    permission === "default" && !pushSubscription && isRunningAsPWA();
  const showActions = showNotificationButton || showInstallButton;

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

        {/* Boutons d'action pour PWA et notifications */}
        {showActions && (
          <>
            <hr />
            <div className="news-actions">
              <p>Want to go further ?</p>
              <div className="button-container">
                {showNotificationButton && (
                  <button
                    className="cta-button button"
                    onClick={handleAskPermission}
                  >
                    <Bell strokeWidth={3} /> Activate notifications
                  </button>
                )}

                {showInstallButton && (
                  <button
                    className="cta-button button"
                    onClick={handleInstallClick}
                  >
                    <Smartphone strokeWidth={3} /> Install the app
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    )
  );
}
