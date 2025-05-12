import { useEffect, useRef, useState } from "react";
import "./InputRange.css";

export default function InputRange({
  value,
  onChange,
  label,
  reset,
  setDefault,
  defaultValue,
  disabled,
  setDisabled,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const rangeRef = useRef(null);

  const updateRangeBackground = (rangeEl) => {
    const val =
      ((rangeEl.value - rangeEl.min) / (rangeEl.max - rangeEl.min)) * 100;
    const color = getComputedStyle(document.documentElement).getPropertyValue(
      "--primary-color"
    );
    rangeEl.style.background = `linear-gradient(to right, ${color} ${val}%, #ddd ${val}%)`;
  };

  useEffect(() => {
    if (rangeRef.current) {
      updateRangeBackground(rangeRef.current);
    }
  }, [value]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      reset();
    } else {
      setDefault();
    }
  }, [disabled]);
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="min-participations">{label}</label>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          id="min-participations"
          value={value ? value : defaultValue}
          onChange={(e) => {
            onChange(e);
            updateRangeBackground(e.target);
          }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          ref={rangeRef}
          className={isDragging ? "dragging" : ""}
        />
      </div>
      <input
        type="checkbox"
        name="min-range"
        id="min-range"
        value={disabled}
        checked={!disabled}
        onChange={(e) => setDisabled(e.target.checked)}
      />
    </div>
  );
}
