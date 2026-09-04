// src/components/Card/Card.tsx
import React, { type ReactNode } from "react";
import styles from "./Card.module.scss";

export interface CardProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ header, footer, children, className }) => {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card;
