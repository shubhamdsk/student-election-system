// src/components/Spinner/Spinner.tsx
import React from "react";
import styles from "./Spinner.module.scss";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  return <div className={`${styles.spinner} ${styles[size]} ${className || ""}`} role="status" aria-label="Loading" />;
};

export default Spinner;
