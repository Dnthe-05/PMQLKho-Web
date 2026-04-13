import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import GettAllSupplierPage from './components/Supplier/GetAllSupplierPage';
import GetAllProductPage from './components/Product/GetAllProductPage';
import WarrantyDetailPage from './components/Warranty/WarrantyDetailPage';
import WarrantyPage from './components/Warranty/WarrantyPage';
import GetAllEmployeePage from './components/Employee/GetAllEmployeePage';
import LoginPage from './components/Auth/LoginPopup'; 
import { getProfile } from './services/Auth/authService';

const HomePage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Chào mừng đến với hệ thống CAG PRO</h2>
    <p>Vui lòng chọn menu phía trên để bắt đầu làm việc.</p>
  </div>
);

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res: any = await getProfile();
        if (res.success) {
          setUser(res.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '100px'}}>Đang tải hệ thống...</div>;

  return (
    <Router>
      <Routes>
       
        <Route path="/login" element={
          user ? <Navigate to="/tong-quan" replace /> : <LoginPage />
        } />

        <Route path="/" element={<Navigate to={user ? "/tong-quan" : "/login"} replace />} />

        <Route path="/tong-quan" element={
          user ? <MainLayout user={user}><HomePage /></MainLayout> : <Navigate to="/login" replace />
        } />

        <Route path="/ncc" element={
          user ? <MainLayout user={user}><GettAllSupplierPage /></MainLayout> : <Navigate to="/login" replace />
        } />
        
        <Route path="/hang-hoa" element={
          user ? <MainLayout user={user}><GetAllProductPage /></MainLayout> : <Navigate to="/login" replace />
        } />

        <Route path="/bao-hanh" element={
          user ? <MainLayout user={user}><WarrantyPage/></MainLayout> : <Navigate to="/login" replace />
        } />
        
        <Route path="/bao-hanh/chi-tiet/:id" element={
           user ? (
             <MainLayout user={user}><WarrantyDetailPage /></MainLayout>
           ) : (
             <Navigate to="/login" replace />
           )
        } />

        <Route path="/nhan-vien" element={
          user ? (
            user.role === 1 ? (
              <MainLayout user={user}><GetAllEmployeePage /></MainLayout>
            ) : (
              <Navigate to="/tong-quan" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        <Route path="*" element={<Navigate to={user ? "/tong-quan" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;