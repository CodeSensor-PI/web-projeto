import React from "react";
import Cleave from "cleave.js/react";
import "./inputField.css";

const InputField = ({
  labelTitle,
  type = "text",
  placeholder,
  id,
  name,
  onChange,
  onBlur,
  list,
  required,
  className,
  value,
  icon,
  width,
  containerWidth,
  disabled,
  maxLength,
  maskType, // 'cpf', 'telefone', 'cep', 'hora', etc
  showPasswordToggle, // Elemento React para o botão de toggle (ex: <button>...</button>)
  ...rest
}) => {
  // Configurações de máscara
  const maskOptions = {
    cpf: {
      delimiters: [".", ".", "-"],
      blocks: [3, 3, 3, 2],
      numericOnly: true,
    },
    telefone: {
      delimiters: ["(", ") ", "-"],
      blocks: [0, 2, 5, 4],
      numericOnly: true,
    },
    cep: { delimiters: ["-"], blocks: [5, 3], numericOnly: true },
    hora: { delimiters: [":"], blocks: [2, 2], numericOnly: true },
    crp: { delimiters: ["/", ""], blocks: [2, 6], numericOnly: true }, // Adicione esta linha
  };

  return (
    <div className={`inputContainer ${containerWidth || "w-[45%]"}}`}>
      <label>{labelTitle}:</label>
      <div className="flex items-center gap-2 relative">
        {icon && <span className="input-icon">{icon}</span>}
        {maskType ? (
          <Cleave
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            options={maskOptions[maskType]}
            list={list}
            required={required}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            className={`inputField ${width || "w-[100%]"} ${className || ""}`}
            {...rest}
          />
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            list={list}
            required={required}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            className={`inputField ${width || "w-[100%]"} ${className || ""}`}
            {...rest}
          />
        )}
        {showPasswordToggle && showPasswordToggle}
      </div>
    </div>
  );
};

export default InputField;
