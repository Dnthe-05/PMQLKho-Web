import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import GettAllSupplierPage from './components/Supplier/GetAllSupplierPage';
import GetAllProductPage from './components/Product/GetAllProductPage';
// import GetAllProductPage from './components/Product/GetAllProductPage';
import WarrantyDetailPage from './components/Warranty/WarrantyDetailPage';
import WarrantyPage from './components/Warranty/WarrantyPage';
import GetAllEmployeePage from './components/Employee/GetAllEmployeePage';
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
          </MainLayout>
        } />
        <Route path="/hang-hoa" element={
          <MainLayout currentPage="GOODS">
            <GetAllProductPage />
          </MainLayout>
        } />
        {/* Bạn có thể thêm các trang Khách hàng, Hàng hóa... tương tự ở đây */}
        <Route path="/bao-hanh" element={
          <MainLayout currentPage="Bảo Hành">
            <WarrantyPage/>
          </MainLayout>
        } />
        <Route path="/bao-hanh/chi-tiet/:id" element={<WarrantyDetailPage />} />

        <Route path="/nhan-vien" element={
          <MainLayout currentPage="Nhân Viên">
            <GetAllEmployeePage />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};
export default App;