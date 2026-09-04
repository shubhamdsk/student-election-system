// src/components/Skeleton/Skeleton.tsx
import React from "react";
import styles from "./Skeleton.module.scss";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  className,
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className || ""}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;
