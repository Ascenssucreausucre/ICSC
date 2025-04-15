import { motion } from "framer-motion";

const DotIndicator = ({ index, currentIndex, onClick, isEdge }) => {
  const isActive = index === currentIndex;

  return (
    <motion.button
      onClick={() => onClick(index)}
      className={`dot-indicator ${
        isActive ? "active" : isEdge ? "edge-dot" : ""
      }`}
      aria-label={`Aller à l'actualité ${index + 1}`}
      layout // <-- permet un repositionnement fluide
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: isActive ? 1 : isEdge ? 0.5 : 0.9 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
    />
  );
};

export default DotIndicator;
