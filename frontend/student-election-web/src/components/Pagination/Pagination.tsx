// src/components/Pagination/Pagination.tsx
import React from "react";
import styles from "./Pagination.module.scss";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={`${styles.pagination} ${className || ""}`} aria-label="Pagination Navigation">
      <button
        className={styles.button}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <div className={styles.pages}>
        {pages.map((p) => (
          <button
            key={p}
            className={`${styles.pageNumber} ${p === currentPage ? styles.active : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        className={styles.button}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
