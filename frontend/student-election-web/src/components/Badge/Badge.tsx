// src/components/Badge/Badge.tsx
import React from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "error" | "info";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "primary", className }) => {
  const variantClass = styles[`ui-badge--${variant}`] || "";
  return (
    <span className={`${styles["ui-badge"]} ${variantClass} ${className || ""}`}>{children}</span>
  );
};

export default Badge;
