import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import "./VerticalMenu.css";

export default function VerticalMenu({
  values = [],
  sectionRefs = [],
  yOffset = 0,
}) {
  const [progressByIndex, setProgressByIndex] = useState([]);

  const [isNearLeftEdge, setIsNearLeftEdge] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const thresholdX = window.innerWidth * 0.15;
      const thresholdY = window.innerHeight - window.innerHeight - yOffset;
      setIsNearLeftEdge(e.clientX < thresholdX && e.clientY > thresholdY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY + yOffset * -1;
      const rawProgress = sectionRefs.map((ref, i) => {
        const curr = ref?.current;
        const next = sectionRefs[i + 1]?.current;
        if (!curr || !next) return 0;

        const start = curr.offsetTop;
        const end = next.offsetTop;

        if (scrollY <= start) return 0;
        if (scrollY >= end) return 1;

        return (scrollY - start) / (end - start);
      });

      // Appliquer la logique "une seule barre active"
      const filteredProgress = rawProgress.map((val, i, arr) => {
        const prev = arr[i - 1];
        const next = arr[i + 1];
        const isOnlyActive =
          (i === 0 || prev === 1) && (i === arr.length - 1 || next === 0);
        return isOnlyActive ? val : val >= 1 ? 1 : 0;
      });

      setProgressByIndex(filteredProgress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [sectionRefs]);

  return (
    <div className={`vertical-menu ${isNearLeftEdge ? "visible" : "hidden"}`}>
      {values.map((item, index) => (
        <div key={index} className="vertical-menu-entry">
          <VerticalMenuItem index={index} name={item.name} goTo={item.goTo} />
          {index < values.length - 1 && (
            <div className="segment-container">
              <div
                className="segment-fill"
                style={{ height: `${(progressByIndex[index] || 0) * 100}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function VerticalMenuItem({ index, name, goTo }) {
  const [hovered, setHovered] = useState(false);
  const nameRef = useRef(null);
  const [nameWidth, setNameWidth] = useState(0);

  useEffect(() => {
    if (nameRef.current) {
      setNameWidth(nameRef.current.offsetWidth);
    }
  }, [name]);

  return (
    <div className="vertical-menu-item-container">
      <button onClick={goTo} className="vertical-menu-item">
        {name}
      </button>
    </div>
  );
}
