// src/components/Sidebar/Sidebar.tsx
import React, { type ReactNode } from "react";
import styles from "./Sidebar.module.scss";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, className }) => {
  return (
    <aside className={`${styles.sidebar} ${className || ""}`}>
      <nav className={styles.nav}>
        {items.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${item.active ? styles.active : ""}`}
            onClick={item.onClick}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
