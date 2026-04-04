import React from 'react';
import styles from '../../css/Button/Button.module.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string; 
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  type = "button", 
  icon 
}) => {
  return (
    <button 
      type={type}
      className={styles.btnCreate} 
      onClick={onClick}
    >
      <span className={styles.icon}>{icon || '+'}</span>
      <span>{text}</span>
    </button>
  );
};

export default Button;