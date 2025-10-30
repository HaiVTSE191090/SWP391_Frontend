// src/components/Navbar/UserMenu.tsx
import React from "react";
import defaultAvatar from "../../images/default-avatar.png";// tìm ảnh mạng

interface UserMenuProps {
  username: string,
  avatarUrl: string,
  onLogout: () => void,
}



const UserMenu: React.FC<UserMenuProps> = ({ username, avatarUrl, onLogout }) => {
  const avatar = avatarUrl || defaultAvatar; // nếu không có hình thì dùng ảnh mặc định

  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle d-flex align-items-center fw-bold"
        href="#"
        id="userMenu"
        role="button"
        data-bs-toggle="dropdown"
      >
        <img
          src={avatar}
          alt="avatar"
          className="rounded-circle me-2"
          width="40"
          height="40"
          style={{ objectFit: "cover" }}
        />
        <span>{username}</span>
      </a>

      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <a className="dropdown-item" href="#">
            Lịch sử thuê xe
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Tài khoản của tôi
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button className="dropdown-item text-danger" onClick={onLogout}>
            Đăng xuất
          </button>
        </li>
      </ul>
    </li>
  );
};

export default UserMenu;
