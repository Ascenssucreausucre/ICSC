import { Ripple } from "primereact/ripple";

export default function Button({
  onClick,
  text = "Submit",
  className = "",
  color = "rgba(255,255,255,0.3)",
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`button ${className} p-ripple`}
      onClick={onClick}
      disabled={disabled}
      style={{ marginBlock: "1rem" }}
      {...props}
    >
      {text}
      <Ripple
        pt={{
          root: {
            style: {
              background: color,
            },
          },
        }}
      />
    </button>
  );
}
