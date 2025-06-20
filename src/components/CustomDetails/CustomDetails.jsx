import { useState, useEffect, useRef } from "react";
import "./CustomDetails.css";
import { Triangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CustomDetails = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const summaryRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target) &&
      summaryRef.current &&
      !summaryRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="details-container"
      ref={summaryRef}
      onClick={() => setIsOpen(!isOpen)}
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
            className="content glass-background"
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
