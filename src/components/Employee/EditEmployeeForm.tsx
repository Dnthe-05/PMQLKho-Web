import { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { updateEmployee } from '../../services/Employee/EmployeeService';
import ConfirmModal from '../ConfirmModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: any; 
}

export default function EditEmployeeForm({ isOpen, onClose, onSuccess, employee }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    FullName: '',
    Username: '',
    Role: 2
  });

  useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        FullName: employee.fullName || '',
        Username: employee.username || '',
        Role: employee.role ?? 2
      });
      setFieldErrors({});
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const mapErrorToFields = (message: string) => {
    const msg = message.toLowerCase();
    const newErrors: Record<string, string> = {};

    if (msg.includes("tên đăng nhập") || msg.includes("username")) {
      newErrors.Username = message;
    }
    if (msg.includes("họ và tên") || msg.includes("fullname") || msg.includes("tên")) {
      newErrors.FullName = message;
    }
    // Nếu form Edit của bạn có cho phép đổi mật khẩu thì giữ lại dòng này:
    if (msg.includes("mật khẩu") || msg.includes("password")) {
      newErrors.Password = message;
    }

    if (Object.keys(newErrors).length === 0) {
      alert(message);
    }

    setFieldErrors(newErrors);
  };

  const serverErrorToField = (errors: any) => {
    const result: Record<string, string> = {};
    for (const key in errors) {
      result[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
    }
    return result;  
  };
  
  const handleSubmit = () => {
    setFieldErrors({});

    if (!formData.FullName || !formData.Username) {
      alert("Vui lòng nhập đầy đủ Họ tên và Tên đăng nhập!");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setFieldErrors({});

    try {
      const payload = {
        FullName: formData.FullName,
        Username: formData.Username,
        Role: Number(formData.Role)
      };

      const res: any = await updateEmployee(employee.id, payload);
      
      if (res && (res.success || res.id)) {
        alert("Cập nhật thông tin nhân viên thành công!");
        onSuccess();
        onClose();
      } else if (res.message) {
        mapErrorToFields(res.message);
      }
    } catch (error: any) {
      const serverData = error.response?.data;
      console.log("Data lỗi từ Server:", serverData);

      if (serverData) {
        if (serverData.errors) {
          setFieldErrors(serverErrorToField(serverData.errors));
        } else if (serverData.message) {
          mapErrorToFields(serverData.message);
        }
      } else {
        alert("Lỗi kết nối máy chủ hoặc lỗi không xác định!");
      }
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={`${styles.modalContent} ${styles.modalEmployee}`}>
          <div className={styles.modalHeader}>
            <div>
              <h2 className={styles.modalTitle}>Cập nhật Nhân viên</h2>
              <p className={styles.modalSubtitle}>Chỉnh sửa thông tin nhân viên <strong>#{employee?.id}</strong></p>
            </div>
            <button type="button" onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
          </div>

          <div className={styles.form}>
            
            <div className={styles.row}>
              <div className={styles.formGroup} style={{ width: '100%' }}>
                <label>Họ và tên <span className={styles.required}>*</span></label>
                <input 
                  className={fieldErrors.FullName ? styles.inputError : ''}
                  type="text" 
                  value={formData.FullName}
                  onChange={e => setFormData({...formData, FullName: e.target.value})} 
                  placeholder="VD: Nguyễn Văn A"
                  autoComplete="off"
                />
                {fieldErrors.FullName && <span className={styles.errorText}>{fieldErrors.FullName}</span>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Tên đăng nhập <span className={styles.required}>*</span></label>
                <input 
                  className={fieldErrors.Username ? styles.inputError : ''}
                  type="text" 
                  value={formData.Username}
                  onChange={e => setFormData({...formData, Username: e.target.value})} 
                  placeholder="VD: nguyenvana_123"
                  autoComplete="off"
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
            
            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
              <button type="button" onClick={handleSubmit} className={styles.btnSubmit}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        title="Xác nhận thay đổi"
        message={`Bạn có chắc chắn muốn cập nhật thông tin cho nhân viên ${employee?.fullName || formData.Username}?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}