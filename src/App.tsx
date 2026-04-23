import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import GettAllSupplierPage from "./components/Supplier/GetAllSupplierPage";
import GetAllProductPage from "./components/Product/GetAllProductPage";
import WarrantyDetailPage from "./components/Warranty/WarrantyDetailPage";
import WarrantyPage from "./components/Warranty/WarrantyPage";
import GetAllEmployeePage from "./components/Employee/GetAllEmployeePage";
import LoginPage from "./components/Auth/LoginPopup";
import { getProfile } from "./services/Auth/authService";
import GetAllCustomerPage from "./components/Customer/GetAllCustomerPage";
import ProductSetting from "./pages/Product/ProductSetting";
import GoodsReceiptPage from "./components/Warehouse/GoodsReceiptPage";
import GoodsReceiptDetailPage from "./components/Warehouse/GoodsReceiptPageDetail";
import GoodsIssuePage from "./components/Warehouse/GoodsIssuePage";
import GoodsIssueDetailPage from "./components/Warehouse/GoodsIssueDetailPage";
import ProductDetailPage from "./components/Product/ProductDetailPage";
import CustomerDetailPage from './components/Customer/CustomerDetailPage';
import EmployeeDetailPage from "./components/Employee/EmployeeDetailPage";
import WarrantyWarningList from './components/Warranty/WarrantyWarningList';


const HomePage = () => (
  <div style={{ padding: "20px" }}>
    <WarrantyWarningList />
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

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Đang tải hệ thống...
      </div>
    );

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/tong-quan" replace /> : <LoginPage />}
        />

        <Route
          path="/"
          element={<Navigate to={user ? "/tong-quan" : "/login"} replace />}
        />

        <Route
          path="/tong-quan"
          element={
            user ? (
              <MainLayout user={user}>
                <HomePage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/ncc"
          element={
            user ? (
              <MainLayout user={user}>
                <GettAllSupplierPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/hang-hoa"
          element={
            user ? (
              <MainLayout user={user}>
                <GetAllProductPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/product/detail/:id" element={
      user ? (
        <MainLayout user={user}>
          <ProductDetailPage />
        </MainLayout>
      ) : (
        <Navigate to="/login" replace />
      )
    } />
        <Route
          path="/nhap-kho"
          element={
            user ? (
              <MainLayout user={user}>
                <GoodsReceiptPage user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/xuat-kho"
          element={
            user ? (
              <MainLayout user={user}>
                <GoodsIssuePage user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/xuat-kho/chi-tiet/:id"
          element={
            user ? (
              <MainLayout user={user}>
                <GoodsIssueDetailPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/nhap-kho/chi-tiet/:id"
          element={
            user ? (
              <MainLayout user={user}>
                <GoodsReceiptDetailPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/bao-hanh"
          element={
            user ? (
              <MainLayout user={user}>
                <WarrantyPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/bao-hanh/chi-tiet/:id"
          element={
            user ? (
              <MainLayout user={user}>
                <WarrantyDetailPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/khach-hang"
          element={
            user ? (
              <MainLayout user={user}>
                <GetAllCustomerPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/nhan-vien"
          element={
            user ? (
              user.role === 1 ? (
                <MainLayout user={user}>
                  <GetAllEmployeePage />
                </MainLayout>
              ) : (
                <Navigate to="/tong-quan" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/thiet-lap-san-pham"
          element={
            user ? (
              <MainLayout user={user}>
                <ProductSetting />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/khach-hang/chi-tiet/:id" element={
          user ? (
             <MainLayout user={user}><CustomerDetailPage /></MainLayout>
           ) : (
             <Navigate to="/login" replace />
           )
        } />

        <Route path="/nhan-vien/chi-tiet/:id" element={
          user ? (
             <MainLayout user={user}><EmployeeDetailPage /></MainLayout>
           ) : (
             <Navigate to="/login" replace />
           )
        } />

        <Route
          path="*"
          element={<Navigate to={user ? "/tong-quan" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
