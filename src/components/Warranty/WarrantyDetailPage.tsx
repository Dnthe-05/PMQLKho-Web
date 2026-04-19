import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/SharedLayout.module.css';
import { getWarrantyById, getProductLifecycle } from '../../services/Warranty/warrantyService';
import {type MachineLifecycle } from "../../types/Warranty/LifecycleWarranty";
import EditWarrantyForm from '../../components/Warranty/EditWarrantyForm';

export default function WarrantyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [warranty, setWarranty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [selectedLifecycle, setSelectedLifecycle] = useState<MachineLifecycle | null>(null);
    const [isLifecycleLoading, setIsLifecycleLoading] = useState(false);

    const getStatusClass = (status: string) => {
    switch (status) {
        case 'Tiếp nhận': return styles.badgeGray;
        case 'Đang xử lý': return styles.badgeBlue;
        case 'Đang gửi hãng': return styles.badgeOrange;
        case 'Đã nhận từ hãng - Chờ trả khách': return styles.badgeGreen;
        case 'Đổi mới': return styles.badgePurple;
        case 'Cho mượn tạm': return styles.badgePink;
        case 'Hoàn thành': return styles.badgeDarkGreen;
        default: return styles.badgeDefault;
    }
};

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

    const handleShowLifecycle = async (serial: string) => {
        setIsLifecycleLoading(true);
        try {
            const res = await getProductLifecycle(serial);
            // @ts-ignore
            setSelectedLifecycle(res.data?.data || res.data);
        } catch (error) {
            console.error("Lỗi lấy vòng đời:", error);
        } finally {
            setIsLifecycleLoading(false);
        }
    };

    const getActionStyle = (action: number) => {
        switch(action) {
            case 1: return { label: 'Tiếp nhận', color: '#3b82f6' };
            case 2: return { label: 'Đổi mới', color: '#10b981' };
            case 3: return { label: 'Cho mượn', color: '#a855f7' };
            case 4: return { label: 'Gửi hãng', color: '#f59e0b' };
            case 5: return { label: 'Hoàn thành', color: '#06b6d4' };
            default: return { label: 'Khác', color: '#64748b' };
        }
    };

    useEffect(() => {
        if (id) fetchDetail();
    }, [id]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
    if (!warranty) return <div style={{ padding: '50px', textAlign: 'center' }}>Không có dữ liệu!</div>;

    const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '---';

    return (
        <div className={styles.pageContainer}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px 15px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    &#8592; Quay lại
                </button>
                <h2 className={styles.pageTitle} style={{ margin: 0 }}>
                    Chi tiết phiếu bảo hành: <span style={{ color: '#e31e24' }}>{warranty.code}</span>
                </h2>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => setIsEditModalOpen(true)} style={{ padding: '6px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Chỉnh sửa / Đổi máy
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>Thông tin khách hàng</h3>
                    <p><strong>Khách hàng:</strong> {warranty.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {warranty.phone}</p>
                    <p><strong>Địa chỉ Trả:</strong> {warranty.returnLocation}</p>
                    <p><strong>Địa chỉ nhận</strong> {warranty.receiveLocation}</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>Thông tin tiếp nhận</h3>
                    <p><strong>Ngày nhận:</strong> {formatDate(warranty.receiveDate)}</p>
                    <p><strong>Ngày hẹn trả:</strong> {formatDate(warranty.returnDate)}</p>
                    <p><strong>Trạng thái:</strong> {
                        warranty.status === 1 ? 'Tiếp nhận' : 
                        warranty.status === 2 ? 'Đang xử lý' : 
                        warranty.status === 3 ? 'Hoàn thành' : 'Hủy bỏ'
                    }</p>
                </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginTop: 0, color: '#333' }}>Thiết bị bảo hành</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className={styles.table} style={{ width: '100%', marginTop: '10px' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                            <tr className={styles.thRow}>
                                <th className={styles.th}>STT</th>
                                <th className={styles.th}>Mã Serial (Lịch sử)</th>
                                <th className={styles.th}>Sản Phẩm</th>
                                <th className={styles.th}>Lỗi mô tả</th>
                                <th className={styles.th}>Trạng thái chi tiết</th>
                                <th className={styles.th}>Ngày gửi hãng</th>
                                <th className={styles.th}>Ngày nhận hãng</th>
                                <th className={styles.th}>Phí dịch vụ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {warranty.details?.map((item: any, index: number) => (
                                <tr key={index} className={styles.tr}>
                                    <td className={styles.td}>{index + 1}</td>
                                    <td className={styles.td}>
                                        <button onClick={() => handleShowLifecycle(item.serialCode)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                                            {item.serialCode}
                                        </button>
                                    </td>
                                    <td className={styles.td}>{item.productName}</td>
                                    <td className={styles.td}>{item.issueDescription}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge ${getStatusClass(item.processingType)}`}>
                                            {item.processingType}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                    {item.sentToVendorDate ? new Date(item.sentToVendorDate).toLocaleDateString('vi-VN') : '---'}
                                    </td>
                                    <td className={styles.td}>
                                    {item.receivedFromVendorDate ? new Date(item.receivedFromVendorDate).toLocaleDateString('vi-VN') : '---'}
                                    </td>
                                    <td className={styles.td} style={{ color: '#e31e24', fontWeight: 'bold' }}>{item.warrantyCost?.toLocaleString()} ₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedLifecycle && (
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                        <h3 style={{margin: 0}}>Lịch sử thiết bị: <span style={{color: '#0284c7'}}>{selectedLifecycle.serial}</span></h3>
                        <button onClick={() => setSelectedLifecycle(null)} style={{padding: '5px 15px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer'}}>Đóng</button>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingLeft: '10px' }}>
                        {selectedLifecycle?.timeline?.map((event, index) => {
                            console.log("Dữ liệu thực tế của một dòng:", event);
                            const style = getActionStyle(Number(event.actionName));
                            return (
                                <div key={index} style={{ marginBottom: '20px', position: 'relative', paddingLeft: '25px', borderLeft: `2px solid ${style.color}` }}>
                                    <div style={{ position: 'absolute', left: '-9px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: style.color, border: '3px solid white' }}></div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>{new Date(event.actionDate).toLocaleString('vi-VN')}</span>
                                        <span style={{ fontSize: '10px', background: style.color, color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{style.label}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>{event.description}</p>
                                    {event.customerName && <small style={{color: '#94a3b8'}}>Khách hàng: {event.customerName}</small>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <EditWarrantyForm isOpen={isEditModalOpen} warrantyId={Number(id)} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchDetail} />
        </div>
    );
}