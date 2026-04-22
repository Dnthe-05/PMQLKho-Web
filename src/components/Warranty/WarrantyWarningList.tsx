import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/WarrantyWarning.module.css';
import { getWarrantyWarnings } from '../../services/Warranty/warrantyService';
import Pagination from '../Pagination'; 

export default function WarrantyWarningList() {
    const [warnings, setWarnings] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; 

    const navigate = useNavigate();

    useEffect(() => {
        fetchWarnings();
    }, [currentPage]);

    const fetchWarnings = async () => {
        setLoading(true);
        try {
            const res = await getWarrantyWarnings(search, currentPage, pageSize);
            const data = res.data?.data || res.data;
            setWarnings(data.items || []);
            setTotalItems(data.totalCount || 0);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
            fetchWarnings();
        }
    };

    const handleGoToDetail = (id: number) => {
        navigate(`/bao-hanh/chi-tiet/${id}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>DANH SÁCH CẢNH BÁO BẢO HÀNH</h3>
                <p className={styles.subtitle}>Các phiếu cần xử lý gấp để đảm bảo tiến độ trả khách.</p>
            </div>

            <div className={styles.toolBar}>
                <div className={styles.searchWrapper}>
                    <input 
                        type="text" 
                        placeholder="Tìm mã phiếu, khách hàng... (Enter)" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className={styles.searchInput}
                    />
                    {/* <span className={styles.searchIcon}>Tìm kiếm</span> */}
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Đang tải dữ liệu cảnh báo...</div>
            ) : (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã Phiếu</th>
                                <th>Khách Hàng</th>
                                <th>Hẹn Trả</th>
                                <th style={{ textAlign: 'center' }}>Lý Do Cảnh Báo</th>
                                <th style={{ textAlign: 'center' }}>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {warnings.length > 0 ? (
                                warnings.map((item, index) => (
                                    <tr key={item.id} className={styles.row} onClick={() => handleGoToDetail(item.id)}>
                                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                        <td className={styles.codeCell}>{item.code}</td>
                                        <td>
                                            <div className={styles.customerName}>{item.customerName}</div>
                                            <div className={styles.customerPhone}>{item.phone}</div>
                                        </td>
                                        <td>{item.returnDate ? new Date(item.returnDate).toLocaleDateString('vi-VN') : '---'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={styles.reasonBadge}>
                                                {item.warningReason}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className={styles.btnDetail} onClick={(e) => {
                                                e.stopPropagation();
                                                handleGoToDetail(item.id);
                                            }}>
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>
                                        Không có cảnh báo nào cần xử lý.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className={styles.paginationArea}>
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}