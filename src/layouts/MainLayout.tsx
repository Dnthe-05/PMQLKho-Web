import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../css/Main/MainLayout.module.css';
import Header from './Header';



interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      
      {/* 1. Gọi Component Header đã tách ở đây */}
      <Header />

      {/* 2. NAV BAR - Giữ nguyên phần này */}
      <nav className={styles.navBar}>
        <div className={styles.navLinks}>
          <NavLink to="/tong-quan" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Tổng quan</NavLink>
          <NavLink to="/hang-hoa" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Hàng hóa</NavLink>
          <NavLink to="/kho-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}> Kho hàng</NavLink>
          <NavLink to="/bao-hanh" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Bảo hành</NavLink>
          <NavLink to="/ncc" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Nhà cung cấp</NavLink>
          <NavLink to="/khach-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Khách hàng</NavLink>
          <NavLink to="/nhan-vien" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem} style={{ textDecoration: 'none' }}>Nhân viên</NavLink>
        </div>
      </nav>

      {/* 3. PHẦN NỘI DUNG CHÍNH */}
      <main className={styles.mainWrapper}>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;