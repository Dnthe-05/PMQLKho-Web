import { useState } from 'react';
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
    Role: 2
  });

  if (!isOpen) return null;

  
  const handleClose = () => {
    setFormData({ Username: '', Password: '', FullName: '', Role: 2 });
    setFieldErrors({});
    setShowPassword(false);
    onClose();
  };

  const mapErrorToFields = (message: string) => {
    const msg = message.toLowerCase();
    const newErrors: Record<string, string> = {};
    
    if (msg.includes("tên đăng nhập") || msg.includes("username")) newErrors.Username = message;
    if (msg.includes("họ và tên") || msg.includes("fullname") || msg.includes("tên")) newErrors.FullName = message;
    if (msg.includes("mật khẩu") || msg.includes("password")) newErrors.Password = message;
    
    if (Object.keys(newErrors).length === 0) {
        alert(message);
    } else {
        setFieldErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    setFieldErrors({}); 

    if (!formData.FullName || !formData.Username || !formData.Password) {
      alert("Vui lòng nhập đầy đủ Họ tên, Tên đăng nhập và Mật khẩu!");
      return;
    }

    try {
      const finalData = { 
        ...formData, 
        Role: Number(formData.Role)
      };

      const res: any = await createEmployee(finalData);
      
      if (res && (res.success || res.id)) {
        alert("Thêm nhân viên thành công!");
        onSuccess(); 
        handleClose(); 
      } else if (res.message) {
         mapErrorToFields(res.message);
      }
    } catch (error: any) {
      console.error("Lỗi thêm nhân viên:", error);
      const serverData = error.response?.data;
      
      if (serverData?.errors) {
        setFieldErrors(serverData.errors);
      } else if (serverData?.message) {
         mapErrorToFields(serverData.message);
      } else {
        alert("Có lỗi xảy ra khi lưu nhân viên. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
     
      <div className={`${styles.modalContent} ${styles.modalEmployee}`}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Thêm mới Nhân viên</h2>
            <p className={styles.modalSubtitle}>Vui lòng nhập thông tin tài khoản nhân viên</p>
          </div>
         
          <button onClick={handleClose} className={styles.btnCloseHeader}>&times;</button>
        </div>


        <div className={styles.form}>
          
          <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', zIndex: -1 }}>
            <input type="text" name="fake_username_trap" tabIndex={-1} autoComplete="username" />
            <input type="password" name="fake_password_trap" tabIndex={-1} autoComplete="current-password" />
          </div>

          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label>Họ và tên <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.FullName ? styles.inputError : ''}
                type="text" 
                
                placeholder="Nhập họ và tên nhân viên..."
                value={formData.FullName} 
                onChange={e => setFormData({...formData, FullName: e.target.value})} 
                autoComplete="off"
              />
              {fieldErrors.FullName && <span className={styles.errorText}>{fieldErrors.FullName}</span>}
            </div>
          </div>

          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên đăng nhập (Username) <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.Username ? styles.inputError : ''}
                type="text" 
               
                placeholder="VD: nguyenvan_a"
                value={formData.Username} 
                onChange={e => setFormData({...formData, Username: e.target.value})} 
                autoComplete="new-password"
              />
              {fieldErrors.Username && <span className={styles.errorText}>{fieldErrors.Username}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Vai trò <span className={styles.required}>*</span></label>
              <select 
                className={fieldErrors.Role ? styles.inputError : ''}
                value={formData.Role} 
                onChange={e => setFormData({...formData, Role: Number(e.target.value)})}
              >
                <option value={1}>Quản trị viên</option>
                <option value={2}>Nhân viên kho</option>

              </select>
              {fieldErrors.Role && <span className={styles.errorText}>{fieldErrors.Role}</span>}
            </div>
          </div>

          
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label>Mật khẩu khởi tạo <span className={styles.required}>*</span></label>
              
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  
                  placeholder="Nhập mật khẩu..."
                  value={formData.Password} 
                  onChange={e => setFormData({...formData, Password: e.target.value})} 
                  className={`${styles.passwordInput} ${fieldErrors.Password ? styles.inputError : ''}`}
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
           
            <button type="button" onClick={handleClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="button" onClick={handleSubmit} className={styles.btnSubmit}>
              + Lưu nhân viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}