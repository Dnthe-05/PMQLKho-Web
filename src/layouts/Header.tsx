import React from 'react';
import styles from '../css/Main/MainLayout.module.css'; 

const Logo = () => (
  <div className={styles.logoWrapper}>
    <img 
      src="/logo.png" 
      alt="CAG PRO Logo" 
      style={{ width: '50px', height: '50px' }} 
    />
    <span className={styles.logoText}>CAG PRO</span>
  </div>
);

const Header: React.FC = () => {
  return (
    <header className={styles.topHeader}>
      <Logo />
      <div className={styles.headerRight}>
        <span className={styles.bellIcon}>🔔</span>
        <div className={styles.userCircle}>👤</div>
      </div>
    </header>
  );
};

export default Header;