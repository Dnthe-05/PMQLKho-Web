import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/SharedLayout.module.css';
import { getCustomerById } from '../../services/Customer/CustomerService';
import EditCustomerForm from '../../components/Customer/EditCustomerForm';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // THÊM STATE ĐỂ QUẢN LÝ TAB ĐANG ACTIVE (Mặc định mở tab Lịch sử mua hàng)
  const [activeTab, setActiveTab] = useState<'goodsIssues' | 'warranties'>('goodsIssues');

  const fetchDetail = async () => {
    try {
      const response = await getCustomerById(Number(id));
      setCustomer(response.data?.data || response.data);
    } catch (error) {
      console.error("Lỗi tải chi tiết khách hàng:", error);
      alert("Không tìm thấy dữ liệu khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (!customer) return <div style={{ padding: '50px', textAlign: 'center' }}>Không có dữ liệu!</div>;

  const formatCurrency = (amount: number) => {
    return amount ? amount.toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '---';

  const renderWarrantyStatus = (status: number) => {
    switch (status) {
      case 1: return <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Tiếp nhận</span>;
      case 2: return <span style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Đang xử lý</span>;
      case 3: return <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Hoàn thành</span>;
      case 4: return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return <span>Không rõ</span>;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: '8px 15px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          &#8592; Quay lại
        </button>
        
        <h2 className={styles.pageTitle} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          Hồ sơ khách hàng: 
          <span style={{ color: customer.deletedAt ? '#888' : '#0284c7', textDecoration: customer.deletedAt ? 'line-through' : 'none' }}>
            {customer.fullName}
          </span>
          
          {customer.deletedAt && (
            <span style={{ fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>
              Ngừng hoạt động
            </span>
          )}
        </h2>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!customer.deletedAt && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                style={{ padding: '8px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✏️ Chỉnh sửa thông tin
              </button>
            )}
        </div>
      </div>

      {/* --- THÔNG TIN CƠ BẢN --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>👤 Thông tin liên lạc</h3>
          <p style={{ margin: '10px 0' }}><strong>Họ và tên:</strong> <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>{customer.fullName}</span></p>
          <p style={{ margin: '10px 0' }}><strong>Số điện thoại:</strong> {customer.phone || '---'}</p>
          <p style={{ margin: '10px 0' }}><strong>Email:</strong> {customer.email || '---'}</p>
          <p style={{ margin: '10px 0', color: '#888', fontSize: '0.9rem' }}><em>Khách hàng từ: {formatDate(customer.createdAt)}</em></p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>📍 Thông tin địa chỉ</h3>
          <p style={{ margin: '10px 0' }}><strong>Địa chỉ giao hàng:</strong> <br/> {customer.shippingAddress || 'Chưa cập nhật'}</p>
          <p style={{ margin: '10px 0' }}><strong>Địa chỉ trả hàng:</strong> <br/> {customer.returnAddress || 'Chưa cập nhật'}</p>
        </div>
      </div>

      {/* --- PHẦN TABS LỊCH SỬ --- */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        {/* Nút chuyển Tab */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('goodsIssues')}
            style={{
              padding: '10px 5px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'goodsIssues' ? '3px solid #0284c7' : '3px solid transparent',
              color: activeTab === 'goodsIssues' ? '#0284c7' : '#666',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.05rem',
              transition: 'all 0.2s'
            }}
          >
            🛒 Lịch sử mua hàng
          </button>
          
          <button
            onClick={() => setActiveTab('warranties')}
            style={{
              padding: '10px 5px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'warranties' ? '3px solid #0284c7' : '3px solid transparent',
              color: activeTab === 'warranties' ? '#0284c7' : '#666',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.05rem',
              transition: 'all 0.2s'
            }}
          >
            🛡️ Lịch sử yêu cầu bảo hành
          </button>
        </div>

        {/* NỘI DUNG TAB 1: PHIẾU XUẤT */}
        {activeTab === 'goodsIssues' && (
          <div>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className={styles.table} style={{ width: '100%', margin: 0 }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f9fafb' }}>
                  <tr className={styles.thRow}>
                    <th className={styles.th} style={{ width: '50px' }}>STT</th>
                    <th className={styles.th}>Mã Hóa Đơn</th>
                    <th className={styles.th}>Ngày Mua</th>
                    <th className={styles.th}>Tổng Tiền</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.goodsIssues && customer.goodsIssues.length > 0 ? (
                    customer.goodsIssues.map((item: any, index: number) => (
                      <tr key={index} className={styles.tr}>
                        <td className={styles.td}>{index + 1}</td>
                        <td className={styles.td}><strong>{item.code}</strong></td>
                        <td className={styles.td}>{formatDate(item.issueDate)}</td>
                        <td className={styles.td} style={{ color: '#16a34a', fontWeight: 'bold' }}>
                          {formatCurrency(item.totalPrice)}
                        </td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <button onClick={() => navigate(`/xuat-kho/chi-tiet/${item.id}`)} style={{ border: 'none', background: 'transparent', color: '#0284c7', cursor: 'pointer', textDecoration: 'underline' }}>Xem</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Khách hàng chưa có lịch sử mua hàng.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Nút Xem tất cả (Chỉ hiện khi có dữ liệu) */}
            {customer.goodsIssues && customer.goodsIssues.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #eee' }}>
                <button 
                  onClick={() => navigate(`/xuat-kho?searchTerm=${customer.fullName}`)}
                  style={{ background: 'transparent', color: '#0284c7', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: '8px 15px' }}
                >
                  Xem tất cả hóa đơn của khách này &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* NỘI DUNG TAB 2: BẢO HÀNH */}
        {activeTab === 'warranties' && (
          <div>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className={styles.table} style={{ width: '100%', margin: 0 }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f9fafb' }}>
                  <tr className={styles.thRow}>
                    <th className={styles.th} style={{ width: '50px' }}>STT</th>
                    <th className={styles.th}>Mã Phiếu BH</th>
                    <th className={styles.th}>Ngày Gửi</th>
                    <th className={styles.th}>Ngày Trả (Dự kiến)</th>
                    <th className={styles.th}>Trạng thái</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.warrantyCards && customer.warrantyCards.length > 0 ? (
                    customer.warrantyCards.map((item: any, index: number) => (
                      <tr key={index} className={styles.tr}>
                        <td className={styles.td}>{index + 1}</td>
                        <td className={styles.td}><strong>{item.code}</strong></td>
                        <td className={styles.td}>{formatDate(item.receiveDate)}</td>
                        <td className={styles.td}>{formatDate(item.returnDate)}</td>
                        <td className={styles.td}>{renderWarrantyStatus(item.status)}</td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <button onClick={() => navigate(`/bao-hanh/chi-tiet/${item.id}`)} style={{ border: 'none', background: 'transparent', color: '#0284c7', cursor: 'pointer', textDecoration: 'underline' }}>Xem</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Khách hàng chưa có yêu cầu bảo hành nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Nút Xem tất cả (Chỉ hiện khi có dữ liệu) */}
            {customer.warrantyCards && customer.warrantyCards.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #eee' }}>
                <button 
                  onClick={() => navigate(`/bao-hanh?searchTerm=${customer.phone}`)}
                  style={{ background: 'transparent', color: '#0284c7', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: '8px 15px' }}
                >
                  Xem tất cả phiếu bảo hành của khách này &rarr;
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- MODAL CHỈNH SỬA KHÁCH HÀNG --- */}
      {isEditModalOpen && (
        <EditCustomerForm 
          isOpen={isEditModalOpen}
          customer={customer} 
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => fetchDetail()}
        />
      )}
    </div>
  );
}