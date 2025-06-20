/**
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Current input value
 * @param {(s: string) => void} onChange - Function called when the value changes
 * @param {string} [type] - Input type (text, email, password, etc.)
 * @param {string} [id] - Input ID
 * @param {string} [label] - Label text
 * @param {string} [name] - Input name
 * @param {boolean} [required] - Indicates whether the input is required
 * @param {object} [style] - Optional CSS styles
 * @param {number} [caractereMin] - Minimum number of characters for the input
 * @param {number} [caractereMax] - Maximum number of characters for the input
 */
import "./Input.css";
import PhoneInputWithCountrySelect from "react-phone-number-input";
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

  return (
    <div
      className={`form-input ${className}${" " + type}${
        disabled ? " disabled" : ""
      }`}
    >
      {label && (
        <label htmlFor={inputId ? inputId : name}>
          {label}
          {required && type !== "radio" && (
            <span className="required-symbol"> *</span>
          )}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          {...props}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={style}
          required={required}
          disabled={disabled}
          className="form-control"
          rows={5}
        ></textarea>
      ) : type === "tel" ? (
        <PhoneInputWithCountrySelect
          {...props}
          international
          id={inputId ? inputId : name}
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
      ) : (
        <input
          {...props}
          id={inputId ? inputId : name}
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
      )}
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
