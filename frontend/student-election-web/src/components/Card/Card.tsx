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
    <div className={`${styles["ui-card"]} ${className || ""}`}>
      {header && <div className={styles["ui-card__header"]}>{header}</div>}
      <div className={styles["ui-card__body"]}>{children}</div>
      {footer && <div className={styles["ui-card__footer"]}>{footer}</div>}
    </div>
  );
};

export default Card;
