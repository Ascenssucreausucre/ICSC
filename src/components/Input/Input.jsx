/**
 * Composant Input personnalisé
 * @param {string} placeholder - Texte indicatif pour l'input
 * @param {string} value - Valeur actuelle de l'input
 * @param {(s: string) => void} onChange - Fonction appelée lors d'un changement
 * @param {string} [type] - Type d'input (text, email, password, etc.)
 * @param {string} [id] - ID de l'input
 * @param {string} [label] - Texte affiché pour le label
 * @param {string} [name] - Nom de l'input
 * @param {boolean} [required] - Indique si l'input est requis
 * @param {object} [style] - Styles CSS optionnels
 * @param {number} [caractereMin] - Nombre minimum de caractères pour l'input
 * @param {number} [caractereMax] - Nombre maximum de caractères pour l'input
 */
import "./Input.css";
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

  // Calcul de la longueur de l'input
  const length = value ? value.length : 0;

  // Message d'erreur basé sur les limites de caractères
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
          rows={5} // Nombre de lignes visibles par défaut
        ></textarea>
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
      {/* Affichage du nombre de caractères uniquement si caractereMin ou caractereMax est renseigné */}
      {(caractereMin || caractereMax) && !disabled && (
        <p style={{ color: "gray", fontSize: "0.85em" }}>
          {length}/{caractereMax} caractères
        </p>
      )}

      {/* Affichage des messages d'erreur si nécessaire */}
      {(minError || maxError) && !disabled && (
        <p style={{ color: "red", fontSize: "0.85em" }}>
          {minError || maxError}
        </p>
      )}
    </div>
  );
}
