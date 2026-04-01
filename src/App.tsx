import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import GettAllSupplierPage from './components/Supplier/GetAllSupplierPage';

// Giả sử bạn có một component trang chủ đơn giản
const HomePage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Chào mừng đến với hệ thống CAG PRO</h2>
    <p>Vui lòng chọn menu phía trên để bắt đầu làm việc.</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/tong-quan" replace />} />

        <Route path="/tong-quan" element={
          <MainLayout currentPage="Tổng quan">
            <HomePage />
          </MainLayout>
        } />

        <Route path="/ncc" element={
          <MainLayout currentPage="NCC">
            <GettAllSupplierPage />
           
            <div style={styles.pagination}>
              <span>|&lt;</span> <span>&lt;</span> 
              <strong style={{color: '#333'}}>1</strong> 
              <span>&gt;</span> <span>&gt;|</span>
            </div>
          </MainLayout>
        } />
        
        {/* Bạn có thể thêm các trang Khách hàng, Hàng hóa... tương tự ở đây */}
      </Routes>
    </Router>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pagination: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '40px', 
    padding: '30px 0', 
    color: '#999',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

export default App;