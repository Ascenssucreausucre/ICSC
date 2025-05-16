import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="spin2"
          cx="400"
          cy="400"
          fill="none"
          r="197"
          strokeWidth="45"
          strokeDasharray="636 1400"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
