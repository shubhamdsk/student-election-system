// src/components/Input/Input.tsx
import React, { type InputHTMLAttributes, useId } from "react";
import styles from "./Input.module.scss";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  type?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  prefixIcon,
  suffixIcon,
  id,
  className,
  type = "text",
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const rootClass = [
    styles["ui-input"],
    error ? styles["ui-input--invalid"] : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      {label && (
        <label htmlFor={inputId} className={styles["ui-input__label"]}>
          {label}
        </label>
      )}
      <div className={styles["ui-input__container"]}>
        {prefixIcon && <span className={styles["ui-input__prefix"]}>{prefixIcon}</span>}
        <input
          id={inputId}
          type={type}
          className={styles["ui-input__field"]}
          {...rest}
        />
        {suffixIcon && <span className={styles["ui-input__suffix"]}>{suffixIcon}</span>}
      </div>
      {error && <span className={styles["ui-input__error-message"]}>{error}</span>}
    </div>
  );
};

export default Input;
