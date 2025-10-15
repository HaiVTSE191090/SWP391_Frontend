export interface ValidationResult {
  fieldErrors: Record<string, string>;
}

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  return /^[0-9]{10}$/.test(phone);
};

export const isStrongPassword = (password: string): boolean => {
  if (!password) return false;
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );
};

export const validateSignUp = (
  formData: Record<string, any>
): ValidationResult => {
  const fieldErrors: Record<string, string> = {};

  if (!formData.fullName) {
    fieldErrors.fullName = "Họ và tên là bắt buộc";
  }

  if (!isValidEmail(formData.email || "")) {
    fieldErrors.email = "Email không hợp lệ";
  }

  if (!isValidPhone(formData.phoneNumber || "")) {
    fieldErrors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số";
  }

  if (!isStrongPassword(formData.password || "")) {
    fieldErrors.password =
      "Mật khẩu cần có ít nhất 8 ký tự, 1 chữ hoa, 1 số và 1 ký tự đặc biệt";
  }

  if ((formData.password || "") !== (formData.confirmPassword || "")) {
    fieldErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  return { fieldErrors };
};
