// src/components/Input/Input.tsx
import React, { type InputHTMLAttributes } from "react";
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
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className={`${styles.inputWrapper} ${className || ""}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {prefixIcon && <span className={styles.prefix}>{prefixIcon}</span>}
        <input
          id={inputId}
          type={type}
          className={`${styles.input} ${error ? styles.error : ""}`}
          {...rest}
        />
        {suffixIcon && <span className={styles.suffix}>{suffixIcon}</span>}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
