import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const AnimatedCounterDigit = ({ value }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: "inline-block", minWidth: "0.5ch" }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
};

export const AnimatedCounter = ({ value }) => {
  const digits = String(value).split("");

  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {digits.map((digit, index) => (
        <AnimatedCounterDigit key={`${index}-${digit}`} value={digit} />
      ))}
    </span>
  );
};
