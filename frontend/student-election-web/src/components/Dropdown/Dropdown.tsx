// src/components/Dropdown/Dropdown.tsx
import React, { type ReactNode, useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.scss";

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, className }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.dropdown} ${className || ""}`} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggle} role="button" aria-haspopup="true" aria-expanded={open}>
        {trigger}
      </div>
      {open && <div className={styles.menu}>{children}</div>}
    </div>
  );
};

export default Dropdown;
