import { useState } from "react";
import "./Input.css";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { Eye, EyeOff } from "lucide-react";

export function Input({
  placeholder = "",
  value,
  onChange,
  style,
  label,
  type = "text",
  name,
  required = false,
  caractereMin,
  caractereMax,
  numberMax,
  numberMin,
  disabled,
  pattern,
  className = "",
  inputId,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const numberProps =
    type === "number"
      ? {
          ...(numberMin !== undefined && { min: numberMin }),
          ...(numberMax !== undefined && { max: numberMax }),
        }
      : {};

  const length = value ? value.length : 0;

  const minError =
    caractereMin && length < caractereMin
      ? `Minimum de ${caractereMin} caractères requis.`
      : "";
  const maxError =
    caractereMax && length > caractereMax
      ? `Maximum de ${caractereMax} caractères autorisés.`
      : "";

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          {...props}
          id={inputId ?? name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={style}
          required={required}
          disabled={disabled}
          className="form-control"
          rows={5}
        />
      );
    } else if (type === "tel") {
      return (
        <PhoneInputWithCountrySelect
          {...props}
          international
          id={inputId ?? name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={style}
          required={required}
          disabled={disabled}
          {...numberProps}
          pattern={pattern}
          className="form-control"
        />
      );
    } else if (isPasswordType) {
      return (
        <div className="password-wrapper">
          <input
            {...props}
            id={inputId ?? name}
            type={showPassword ? "text" : "password"}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            style={style}
            required={required}
            disabled={disabled}
            {...numberProps}
            pattern={pattern}
            className="form-control"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      );
    } else {
      return (
        <input
          {...props}
          id={inputId ?? name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={style}
          required={required}
          disabled={disabled}
          {...numberProps}
          pattern={pattern}
          className="form-control"
        />
      );
    }
  };

  return (
    <div
      className={`form-input ${className}${" " + type}${
        disabled ? " disabled" : ""
      }`}
    >
      {label && (
        <label htmlFor={inputId ?? name}>
          {label}
          {required && type !== "radio" && (
            <span className="required-symbol"> *</span>
          )}
        </label>
      )}

      {renderInput()}

      {(caractereMin || caractereMax) && !disabled && (
        <p style={{ color: "gray", fontSize: "0.85em" }}>
          {length}/{caractereMax} caractères
        </p>
      )}

      {(minError || maxError) && !disabled && (
        <p style={{ color: "red", fontSize: "0.85em" }}>
          {minError || maxError}
        </p>
      )}
    </div>
  );
}
