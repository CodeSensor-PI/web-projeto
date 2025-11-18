import React from "react";
import "./simpleButton.css";

const SimpleButton = ({
  type = "button",
  text = "Ok",
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary", // 'primary' | 'secondary' | custom
  size = "md", // 'md' | 'small'
}) => {
  const variantClass = variant === "secondary" ? "simple-secondary-btn" : "";
  const sizeClass = size === "small" ? "small" : "";

  const classes = [
    "simple-btn",
    variantClass,
    sizeClass,
    disabled ? "simple-btn-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children || text}
    </button>
  );
};

export default SimpleButton;
