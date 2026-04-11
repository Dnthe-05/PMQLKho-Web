import { useState } from 'react';

export const useWarrantyValidation = () => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateDuplicate = (items: any[], index: number, currentCode: string, fieldName: string) => {
    const code = currentCode.trim().toUpperCase();
    if (!code) return true;

    const isDuplicate = items.some((item, i) => 
      i !== index && (item[fieldName] || "").toString().trim().toUpperCase() === code
    );

    if (isDuplicate) {
      const msg = `Lỗi: Mã Serial "${code}" đã tồn tại trong danh sách!`;
      alert(msg);
      return false;
    }
    return true;
  };

  const validateAllSerials = (items: any[], fieldName: string) => {
    const serials = items
      .map(i => (i[fieldName] || "").toString().trim().toUpperCase())
      .filter(s => s !== "");
    
    const hasDuplicate = serials.some((s, idx) => serials.indexOf(s) !== idx);
    if (hasDuplicate) {
      alert("Danh sách có mã Serial bị trùng lặp. Vui lòng kiểm tra lại!");
      return false;
    }
    return true;
  };

  return { validationError, setValidationError, validateDuplicate, validateAllSerials };
};