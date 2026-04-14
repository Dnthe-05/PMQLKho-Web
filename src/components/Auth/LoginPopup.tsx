import React, { useState } from 'react';
import styles from '../../css/Auth/Login.module.css';
import { login } from '../../services/Auth/authService';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res: any = await login(username, password);
      if (res && res.success) {
        window.location.href = '/tong-quan'; 
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError("Tài khoản hoặc mật khẩu không đúng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <h2>ĐĂNG NHẬP HỆ THỐNG</h2>
        </div>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Tài khoản</label>
            <input 
              type="text" 
              placeholder="Nhập tên đăng nhập"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Mật khẩu</label>
            <input
              type="password" 
              placeholder="Nhập mật khẩu"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.btnLogin} disabled={isSubmitting}>
            {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
          </button>
        </form>
      </div>
    </div>
  );
}