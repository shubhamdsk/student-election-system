// src/components/Checkbox/Checkbox.tsx
import React, { type InputHTMLAttributes, useId } from "react";
import styles from "./Checkbox.module.scss";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  indeterminate = false,
  id,
  className,
  ...rest
}) => {
  const generatedId = useId();
  const checkboxId = id || `checkbox-${generatedId}`;

  return (
    <div className={`${styles["ui-checkbox"]} ${className || ""}`}>
      <input
        type="checkbox"
        id={checkboxId}
        className={styles["ui-checkbox__input"]}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        {...rest}
      />
      {label && (
        <label htmlFor={checkboxId} className={styles["ui-checkbox__label"]}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
