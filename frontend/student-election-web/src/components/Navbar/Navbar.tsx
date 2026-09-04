// src/components/Navbar/Navbar.tsx
import React, { type ReactNode } from "react";
import styles from "./Navbar.module.scss";

export interface NavbarProps {
  brandName?: string;
  logo?: ReactNode;
  userMenu?: ReactNode;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName = "Student Election System",
  logo,
  userMenu,
  className,
}) => {
  return (
    <header className={`${styles.navbar} ${className || ""}`}>
      <div className={styles.brand}>
        {logo && <span className={styles.logo}>{logo}</span>}
        <span className={styles.brandText}>{brandName}</span>
      </div>
      {userMenu && <div className={styles.userMenu}>{userMenu}</div>}
    </header>
  );
};

export default Navbar;
