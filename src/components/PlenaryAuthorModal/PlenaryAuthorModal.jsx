import { motion } from "framer-motion";
import "./PlenaryAuthorModal.css";
import { CrossIcon } from "lucide-react";
import { X } from "lucide-react";
import Linkify from "linkify-react";

export default function PlenaryAuthorModal({ data, image, onClose, resume }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="author-bio"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button className="button-svg" onClick={onClose}>
          <X />
        </button>
        <div className="author-modal-header">
          <h3 className="title">
            {data.map(
              (author) =>
                `${author.title ? author.title + " " : ""}${author.name} ${
                  author.surname
                }, ${author.affiliation}`
            )}
          </h3>

          <img src={import.meta.env.VITE_IMAGE_URL + image} />
        </div>
        <hr />
        <p>
          <Linkify options={{ target: "_blank" }}>{resume}</Linkify>
        </p>
      </motion.div>
    </motion.div>
  );
}
