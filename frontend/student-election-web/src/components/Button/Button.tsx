// src/components/Button/Button.tsx
import React from 'react';
import styles from './Button.module.css';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'icon' | 'danger';
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...rest }) => {
  const variantClass = styles[variant] || '';
  return (
    <button className={`${styles.button} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;

