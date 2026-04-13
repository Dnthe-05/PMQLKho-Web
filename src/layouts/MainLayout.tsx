import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../css/Main/MainLayout.module.css';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  user: any;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, user }) => {
  return (
    <div className={styles.container}>
      <Header user={user} />

      <nav className={styles.navBar}>
        <div className={styles.navLinks}>
          <NavLink to="/tong-quan" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            Tổng quan
          </NavLink>
          
          {/* Cấu trúc Dropdown chuẩn: dropdownContent phải nằm TRONG dropdown */}
          <div className={styles.dropdown}>
            <NavLink 
              to="/hang-hoa" 
              className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}
            >
              Hàng hóa
            </NavLink>
            
            <div className={styles.dropdownContent}>
              <NavLink to="/thiet-lap-san-pham?tab=attribute">Thuộc tính</NavLink>
            </div>
          </div>

          <NavLink to="/kho-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Kho hàng</NavLink>
          <NavLink to="/bao-hanh" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Bảo hành</NavLink>
          <NavLink to="/ncc" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Nhà cung cấp</NavLink>
          <NavLink to="/khach-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Khách hàng</NavLink>

          {user?.role === 1 && (
            <NavLink to="/nhan-vien" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
              Nhân Viên
            </NavLink>
          )}
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