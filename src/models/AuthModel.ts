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

export interface UserMenuProps {
  username: string;
  avatarUrl?: string;
  onLogout: () => void;
}
