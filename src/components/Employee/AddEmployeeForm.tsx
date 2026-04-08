import React, { useState } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { createEmployee } from '../../services/Employee/EmployeeService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEmployeeForm({ isOpen, onClose, onSuccess }: Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    FullName: '',
    Role: 3 
  });

  if (!isOpen) return null;

  // Hàm gộp: Vừa đóng form, vừa làm sạch dữ liệu
  const handleClose = () => {
    setFormData({ Username: '', Password: '', FullName: '', Role: 3 });
    setFieldErrors({});
    setShowPassword(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({}); 

    try {
      const finalData = { 
        ...formData, 
        Role: Number(formData.Role)
      };

      const res: any = await createEmployee(finalData);
      
      if (res) {
        alert("Thêm nhân viên thành công!");
        onSuccess(); 
        handleClose(); // Gọi hàm dọn dẹp ở đây
      }
    } catch (error: any) {
      console.error("Lỗi thêm nhân viên:", error);
      const serverData = error.response?.data;
      
      if (serverData?.errors) {
        setFieldErrors(serverData.errors);
      } else {
        alert("Có lỗi xảy ra khi lưu nhân viên. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      {/* Ghép 2 class: modalContent (gốc) và modalEmployee (mới thêm) */}
      <div className={`${styles.modalContent} ${styles.modalEmployee}`}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Thêm mới Nhân viên</h2>
            <p className={styles.modalSubtitle}>Vui lòng nhập thông tin tài khoản nhân viên</p>
          </div>
          {/* Nút X gọi handleClose */}
          <button onClick={handleClose} className={styles.btnCloseHeader}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hàng 1: Họ tên */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label>Họ và tên <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                required 
                placeholder="Nhập họ và tên nhân viên..."
                value={formData.FullName} 
                onChange={e => setFormData({...formData, FullName: e.target.value})} 
              />
              {fieldErrors.FullName && <span className={styles.errorText}>{fieldErrors.FullName}</span>}
            </div>
          </div>

          {/* Hàng 2: Tên đăng nhập & Vai trò */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên đăng nhập (Username) <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                required 
                placeholder="VD: nguyenvan_a"
                value={formData.Username} 
                onChange={e => setFormData({...formData, Username: e.target.value})} 
                autoComplete="off"
              />
              {fieldErrors.Username && <span className={styles.errorText}>{fieldErrors.Username}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Vai trò <span className={styles.required}>*</span></label>
              <select 
                required 
                value={formData.Role} 
                onChange={e => setFormData({...formData, Role: Number(e.target.value)})}
              >
                <option value={1}>Quản trị viên</option>
                <option value={2}>Nhân viên kho</option>
                <option value={3}>Nhân viên bán hàng</option>
              </select>
              {fieldErrors.Role && <span className={styles.errorText}>{fieldErrors.Role}</span>}
            </div>
          </div>

          {/* Hàng 3: Mật khẩu */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label>Mật khẩu khởi tạo <span className={styles.required}>*</span></label>
              
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Nhập mật khẩu..."
                  value={formData.Password} 
                  onChange={e => setFormData({...formData, Password: e.target.value})} 
                  className={styles.passwordInput}
                  autoComplete="new-password"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? "👁️" : "🙈"} 
                </button>
              </div>

              {fieldErrors.Password && <span className={styles.errorText}>{fieldErrors.Password}</span>}
            </div>
          </div>

          <div className={styles.formActions}>
            {/* Nút Hủy bỏ gọi handleClose */}
            <button type="button" onClick={handleClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="submit" className={styles.btnSubmit}>+ Lưu nhân viên</button>
          </div>
        </form>
      </div>
    </div>
  );
}