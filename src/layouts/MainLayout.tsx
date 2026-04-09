import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../css/Main/MainLayout.module.css';
import Header from './Header';



interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage }) => {
  return (
    <div className={styles.container}>
      
      <Header />

  <nav className={styles.navBar}>
    <div className={styles.navLinks}>
      <NavLink to="/tong-quan" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Tổng quan</NavLink>
      
      {/* Bắt đầu Dropdown Hàng Hóa */}
      <div className={styles.dropdown}>
        <NavLink to="/hang-hoa" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
          Hàng hóa <span style={{ marginLeft: '5px', fontSize: '10px' }}></span>
        </NavLink>
        
        <div className={styles.dropdownContent}>
          <NavLink to="/danh-muc">Danh mục</NavLink>
          <NavLink to="/nhan-hang">Nhãn hàng</NavLink>
          <NavLink to="/don-vi">Đơn vị</NavLink>
        </div>
      </div>
      {/* Kết thúc Dropdown Hàng Hóa */}

      <NavLink to="/kho-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Kho hàng</NavLink>
      <NavLink to="/bao-hanh" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Bảo hành</NavLink>
      <NavLink to="/ncc" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Nhà cung cấp</NavLink>
      <NavLink to="/khach-hang" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Khách hàng</NavLink>
      <NavLink to="/nhan-vien" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>Nhân Viên</NavLink>
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