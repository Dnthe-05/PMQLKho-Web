import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/SharedLayout.module.css';
import { getWarrantyById } from '../../services/Warranty/warrantyService';
import EditWarrantyForm from '../../components/Warranty/EditWarrantyForm';

export default function WarrantyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [warranty, setWarranty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDetail = async () => {
      try {
        const response = await getWarrantyById(Number(id));
        setWarranty(response.data?.data || response.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
        alert("Không tìm thấy dữ liệu phiếu bảo hành!");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (!warranty) return <div style={{ padding: '50px', textAlign: 'center' }}>Không có dữ liệu!</div>;

  const renderStatus = (status: number) => {
    switch (status) {
      case 1: return <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}>Tiếp nhận</span>;
      case 2: return <span style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}>Đang xử lý</span>;
      case 3: return <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}>Hoàn thành</span>;
      case 4: return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return <span>Không rõ</span>;
    }
  };

  const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '---';

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: '8px 15px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          &#8592; Quay lại
        </button>
        <h2 className={styles.pageTitle} style={{ margin: 0 }}>
          Chi tiết phiếu bảo hành: <span style={{ color: '#e31e24' }}>{warranty.code}</span>
        </h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              style={{ padding: '6px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
            Chỉnh sửa
            </button>
            
            {renderStatus(warranty.status)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>👤 Thông tin khách hàng</h3>
          <p><strong>Tên khách hàng:</strong> {warranty.customer?.customerName || warranty.customerName}</p>
          <p><strong>Số điện thoại:</strong> {warranty.customer?.phone || warranty.phone}</p>
          <p><strong>Địa chỉ:</strong> {warranty.customer?.address || warranty.address || '---'}</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>📅 Thông tin tiếp nhận</h3>
          <p><strong>Ngày nhận:</strong> {formatDate(warranty.receiveDate)}</p>
          <p><strong>Hẹn trả:</strong> {formatDate(warranty.returnDate)}</p>
          <p><strong>Nơi nhận:</strong> {warranty.receiveLocation || '---'}</p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>🛠️ Chi tiết thiết bị bảo hành</h3>
        <table className={styles.table} style={{ width: '100%', marginTop: '15px' }}>
          <thead>
            <tr className={styles.thRow}>
              <th className={styles.th}>STT</th>
              <th className={styles.th}>Mã Serial</th>
              <th  className={styles.th}>Tên Sản Phẩm</th>
              <th className={styles.th}>Tình trạng lỗi</th>
              <th className={styles.th}>Ngày gửi hãng</th>
              <th className={styles.th}>Ngày Trả từ hãng</th>
              <th className={styles.th}>Chi phí (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {warranty.details && warranty.details.length > 0 ? (
              warranty.details.map((item: any, index: number) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>{index + 1}</td>
                  <td className={styles.td}><strong>{item.serialCode || 'N/A'}</strong></td>
                  <td className={styles.td}><strong>{item.productName || 'Chưa xác định'}</strong></td>
                  <td className={styles.td}>{item.issueDescription || '---'}</td>
                  <td className={styles.td}>{formatDate(item.sentToVendorDate)}</td>
                  <td className={styles.td}>{formatDate(item.receivedFromVendorDate)}</td>
                  <td className={styles.td} style={{ color: '#e31e24', fontWeight: 'bold' }}>
                    {item.warrantyCost ? item.warrantyCost.toLocaleString('vi-VN') : '0'} ₫
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Không có chi tiết sản phẩm</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <EditWarrantyForm 
        isOpen={isEditModalOpen}
        warrantyId={Number(id)}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {fetchDetail();}}
      />
    </div>
  );
}