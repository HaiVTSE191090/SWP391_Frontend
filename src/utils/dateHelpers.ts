
export const convertToDateInput = (dateStr: string): string => {
  if (!dateStr) return "";
  
  // Nếu đã đúng format YYYY-MM-DD
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  
  // Nếu format DD/MM/YYYY hoặc DD-MM-YYYY
  const parts = dateStr.split(/[/-]/);
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Nếu format DDMMYYYY (không có dấu)
  if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);
    return `${year}-${month}-${day}`;
  }
  
  return "";
};

/**
 * Convert YYYY-MM-DD sang DD/MM/YYYY (format hiển thị)
 * @param dateStr - Chuỗi ngày ở format YYYY-MM-DD
 * @returns Chuỗi ngày ở format DD/MM/YYYY
 * 
 * @example
 * convertToDisplayDate("2005-01-05") // "05/01/2005"
 */
export const convertToDisplayDate = (dateStr: string): string => {
  if (!dateStr) return "";
  
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  return dateStr;
};

/**
 * Kiểm tra xem ngày có hợp lệ không
 * @param dateStr - Chuỗi ngày cần kiểm tra
 * @returns true nếu ngày hợp lệ, false nếu không
 * 
 * @example
 * isValidDate("05/01/2005") // true
 * isValidDate("32/13/2005") // false
 */
export const isValidDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  const dateInput = convertToDateInput(dateStr);
  if (!dateInput) return false;
  
  const date = new Date(dateInput);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Format ngày về dạng YYYY-MM-DD cho Backend
 * @param dateStr - Chuỗi ngày ở bất kỳ format nào
 * @returns Chuỗi ngày ở format YYYY-MM-DD hoặc empty string
 */
export const formatDateForBackend = (dateStr: string): string => {
  return convertToDateInput(dateStr);
};

/**
 * Lấy ngày hiện tại ở format YYYY-MM-DD
 * @returns Chuỗi ngày hiện tại
 */
export const getTodayDateInput = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Lấy ngày hiện tại ở format DD/MM/YYYY
 * @returns Chuỗi ngày hiện tại
 */
export const getTodayDisplayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

/**
 * Parse date string thành Date object an toàn (dùng cho DatePicker)
 * @param dateStr - Chuỗi ngày ở format DD/MM/YYYY hoặc DDMMYYYY
 * @returns Date object hoặc null nếu invalid
 * 
 * @example
 * parseDateSafe("05/01/2005") // Date object
 * parseDateSafe("invalid") // null
 */
export const parseDateSafe = (dateStr: string | undefined | null): Date | null => {
  if (!dateStr || dateStr.trim() === "") return null;
  
  try {
    // Chuyển sang format YYYY-MM-DD
    const isoFormat = convertToDateInput(dateStr);
    if (!isoFormat) return null;
    
    // Parse thành Date
    const date = new Date(isoFormat);
    
    // Kiểm tra valid
    if (isNaN(date.getTime())) return null;
    
    return date;
  } catch (error) {
    console.error("Error parsing date:", dateStr, error);
    return null;
  }
};
