import React, { useState } from 'react';
import styles from '../css/Main/MainLayout.module.css'; 
import { logout } from '../services/Auth/authService';

interface HeaderProps {
  user: any;
}

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

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      window.location.href = '/login';
    }
  };

  return (
    <header className={styles.topHeader}>
      <Logo />
      <div className={styles.headerRight}>
        <span className={styles.bellIcon} style={{ cursor: 'pointer', fontSize: '20px' }}>🔔</span>
        
        <div 
          className={styles.userContainer} 
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px' }}
        >
          <span className={styles.userName} style={{ fontWeight: '600', color: '#333' }}>
            {user?.fullName || 'Nhân viên'}
          </span>
          <div className={styles.userCircle}>👤</div>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '10px 0',
              minWidth: '150px',
              zIndex: 1000,
              marginTop: '5px'
            }}>
              <div 
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  color: '#d32f2f',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
              Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;