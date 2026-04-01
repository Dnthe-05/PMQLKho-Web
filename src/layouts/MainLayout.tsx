import React from 'react';
import { NavLink } from 'react-router-dom'; // Thêm import này
import styles from '../css/Main/MainLayout.module.css';

const Logo = () => (
  <div className={styles.logoWrapper}>
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#E31E24">
      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
    </svg>
    <span className={styles.logoText}>CAG PRO</span>
  </div>
);

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.topHeader}>
        <Logo />
        <div className={styles.headerRight}>
          <span className={styles.bellIcon}>🔔</span>
          <div className={styles.userCircle}>👤</div>
        </div>
      </header>

{/* NAV BAR */}
      <nav className={styles.navBar}>
        <div className={styles.navLinks}>
          
          <NavLink to="/tong-quan" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Tổng quan</NavLink>
       
          <NavLink to="/hang-hoa" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Hàng hóa</NavLink>

          <NavLink to="/kho-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}> Kho hàng</NavLink>

          <NavLink to="/bao-hanh" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Bảo hành</NavLink>

          <NavLink to="/ncc" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>NCC</NavLink>

          <NavLink to="/khach-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Khách hàng</NavLink>

        </div>
      </nav>

      <main className={styles.mainWrapper}>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;