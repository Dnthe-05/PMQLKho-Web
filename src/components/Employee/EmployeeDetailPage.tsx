import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/SharedLayout.module.css';
import { getEmployeeById } from '../../services/Employee/EmployeeService';
import EditEmployeeForm from '../../components/Employee/EditEmployeeForm';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Quản lý Tab: 3 trạng thái
  const [activeTab, setActiveTab] = useState<'goodsIssues' | 'goodsReceipts' | 'warranties'>('goodsIssues');

  const fetchDetail = async () => {
    try {
      const response = await getEmployeeById(Number(id));
      setEmployee(response.data?.data || response.data);
    } catch (error) {
      console.error("Lỗi tải chi tiết nhân viên:", error);
      alert("Không tìm thấy dữ liệu nhân viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (!employee) return <div style={{ padding: '50px', textAlign: 'center' }}>Không có dữ liệu!</div>;

  const formatCurrency = (amount: number) => amount ? amount.toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '---';

  const renderRole = (role: number) => role === 1 ? 'Quản trị viên (Admin)' : 'Nhân viên';
  const renderWarrantyStatus = (status: number) => {
    switch (status) {
      case 1: return <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Tiếp nhận</span>;
      case 2: return <span style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Đang xử lý</span>;
      case 3: return <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Hoàn thành</span>;
      case 4: return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return <span>Không rõ</span>;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 15px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          &#8592; Quay lại
        </button>
        
        <h2 className={styles.pageTitle} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          Hồ sơ nhân viên: 
          <span style={{ color: employee.deletedAt ? '#888' : '#0284c7', textDecoration: employee.deletedAt ? 'line-through' : 'none' }}>
            {employee.fullName}
          </span>
          {employee.deletedAt && (
            <span style={{ fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>Đã nghỉ việc / Khóa</span>
          )}
        </h2>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            {!employee.deletedAt && (
              <button onClick={() => setIsEditModalOpen(true)} style={{ padding: '8px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                ✏️ Chỉnh sửa thông tin
              </button>
            )}
        </div>
      </div>

      {/* --- THÔNG TIN CƠ BẢN --- */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>👤 Thông tin tài khoản</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
                <p style={{ margin: '10px 0' }}><strong>Tên đăng nhập:</strong> {employee.username}</p>
                <p style={{ margin: '10px 0' }}><strong>Họ và tên:</strong> <span style={{ fontWeight: 'bold' }}>{employee.fullName}</span></p>
            </div>
            <div>
                <p style={{ margin: '10px 0' }}><strong>Vai trò:</strong> {renderRole(employee.role)}</p>
                <p style={{ margin: '10px 0' }}><strong>Ngày vào làm:</strong> {formatDate(employee.createdAt)}</p>
            </div>
        </div>
      </div>

      {/* --- PHẦN TABS LỊCH SỬ --- */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        {/* Nút chuyển Tab */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab('goodsIssues')} style={{ padding: '10px 5px', border: 'none', background: 'transparent', borderBottom: activeTab === 'goodsIssues' ? '3px solid #0284c7' : '3px solid transparent', color: activeTab === 'goodsIssues' ? '#0284c7' : '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem' }}>
            🛒 Đã lập Phiếu Xuất
          </button>
          <button onClick={() => setActiveTab('goodsReceipts')} style={{ padding: '10px 5px', border: 'none', background: 'transparent', borderBottom: activeTab === 'goodsReceipts' ? '3px solid #0284c7' : '3px solid transparent', color: activeTab === 'goodsReceipts' ? '#0284c7' : '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem' }}>
            📦 Đã lập Phiếu Nhập
          </button>
          <button onClick={() => setActiveTab('warranties')} style={{ padding: '10px 5px', border: 'none', background: 'transparent', borderBottom: activeTab === 'warranties' ? '3px solid #0284c7' : '3px solid transparent', color: activeTab === 'warranties' ? '#0284c7' : '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem' }}>
            🛡️ Xử lý Bảo hành
          </button>
        </div>

        {/* TAB 1: PHIẾU XUẤT */}
        {activeTab === 'goodsIssues' && (
          <div>
            <table className={styles.table} style={{ width: '100%', margin: 0 }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr className={styles.thRow}>
                  <th className={styles.th} style={{ width: '50px' }}>STT</th>
                  <th className={styles.th}>Mã Hóa Đơn</th>
                  <th className={styles.th}>Ngày Xuất</th>
                  <th className={styles.th}>Tổng Tiền</th>
                  <th className={styles.th} style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employee.goodsIssues && employee.goodsIssues.length > 0 ? (
                  employee.goodsIssues.map((item: any, idx: number) => (
                    <tr key={idx} className={styles.tr}>
                      <td className={styles.td}>{idx + 1}</td>
                      <td className={styles.td}><strong>{item.code}</strong></td>
                      <td className={styles.td}>{formatDate(item.issueDate)}</td>
                      <td className={styles.td} style={{ color: '#16a34a', fontWeight: 'bold' }}>{formatCurrency(item.totalPrice)}</td>
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        <button onClick={() => navigate(`/xuat-kho/chi-tiet/${item.id}`)} style={{ border: 'none', background: 'transparent', color: '#0284c7', cursor: 'pointer', textDecoration: 'underline' }}>Xem</button>
                      </td>
                    </tr>
                  ))
                ) : ( <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nhân viên này chưa lập phiếu xuất nào.</td></tr> )}
              </tbody>
            </table>
            {/* {employee.goodsIssues?.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #eee' }}>
                <button onClick={() => navigate(`/xuat-kho?searchTerm=${employee.fullName}`)} style={{ background: 'transparent', color: '#0284c7', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Xem tất cả phiếu xuất &rarr;</button>
              </div>
            )} */}
          </div>
        )}

        {/* TAB 2: PHIẾU NHẬP */}
        {activeTab === 'goodsReceipts' && (
          <div>
            <table className={styles.table} style={{ width: '100%', margin: 0 }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr className={styles.thRow}>
                  <th className={styles.th} style={{ width: '50px' }}>STT</th>
                  <th className={styles.th}>Mã Phiếu Nhập</th>
                  <th className={styles.th}>Ngày Nhập</th>
                  <th className={styles.th}>Tổng Tiền</th>
                  <th className={styles.th} style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employee.goodsReceipts && employee.goodsReceipts.length > 0 ? (
                  employee.goodsReceipts.map((item: any, idx: number) => (
                    <tr key={idx} className={styles.tr}>
                      <td className={styles.td}>{idx + 1}</td>
                      <td className={styles.td}><strong>{item.code}</strong></td>
                      <td className={styles.td}>{formatDate(item.createdAt)}</td>
                      <td className={styles.td} style={{ color: '#16a34a', fontWeight: 'bold' }}>{formatCurrency(item.totalPrice)}</td>
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        <button onClick={() => navigate(`/nhap-kho/chi-tiet/${item.id}`)} style={{ border: 'none', background: 'transparent', color: '#0284c7', cursor: 'pointer', textDecoration: 'underline' }}>Xem</button>
                      </td>
                    </tr>
                  ))
                ) : ( <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nhân viên này chưa lập phiếu nhập nào.</td></tr> )}
              </tbody>
            </table>
            {/* {employee.goodsReceipts?.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #eee' }}>
                <button onClick={() => navigate(`/nhap-kho?searchTerm=${employee.fullName}`)} style={{ background: 'transparent', color: '#0284c7', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Xem tất cả phiếu nhập &rarr;</button>
              </div>
            )} */}
          </div>
        )}

        {/* TAB 3: BẢO HÀNH */}
        {activeTab === 'warranties' && (
          <div>
            <table className={styles.table} style={{ width: '100%', margin: 0 }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr className={styles.thRow}>
                  <th className={styles.th} style={{ width: '50px' }}>STT</th>
                  <th className={styles.th}>Mã Phiếu BH</th>
                  <th className={styles.th}>Ngày Tiếp Nhận</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={styles.th} style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employee.warrantyCards && employee.warrantyCards.length > 0 ? (
                  employee.warrantyCards.map((item: any, idx: number) => (
                    <tr key={idx} className={styles.tr}>
                      <td className={styles.td}>{idx + 1}</td>
                      <td className={styles.td}><strong>{item.code}</strong></td>
                      <td className={styles.td}>{formatDate(item.receiveDate)}</td>
                      <td className={styles.td}>{renderWarrantyStatus(item.status)}</td>
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        <button onClick={() => navigate(`/bao-hanh/chi-tiet/${item.id}`)} style={{ border: 'none', background: 'transparent', color: '#0284c7', cursor: 'pointer', textDecoration: 'underline' }}>Xem</button>
                      </td>
                    </tr>
                  ))
                ) : ( <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nhân viên này chưa xử lý bảo hành nào.</td></tr> )}
              </tbody>
            </table>
            {/* {employee.warrantyCards?.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #eee' }}>
                <button onClick={() => navigate(`/bao-hanh?searchTerm=${employee.fullName}`)} style={{ background: 'transparent', color: '#0284c7', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Xem tất cả phiếu bảo hành &rarr;</button>
              </div>
            )} */}
          </div>
        )}
      </div>
      
      {isEditModalOpen && (
        <EditEmployeeForm isOpen={isEditModalOpen} 
        employee={employee} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={() => fetchDetail()} 
        />
      )} 
     
    </div>
  );
}