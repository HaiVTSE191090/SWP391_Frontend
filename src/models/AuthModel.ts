export interface SignUpRequest {
  phone: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  token?: string;
  user?: any;
}

export interface UserMenuProps {
  username: string;
  avatarUrl?: string;
  onLogout: () => void;
}
