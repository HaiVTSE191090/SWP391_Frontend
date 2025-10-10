# Ví dụ xử lý Error từ Backend

## Format Response từ Backend:

### 1. Success Response:
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "justinbiahoi123@gmail.com",
    "kycStatus": "NEED_UPLOAD"
  }
}
```

### 2. Error Response - String:
```json
{
  "status": "error",
  "code": 401,
  "data": "Mật khẩu không chính xác"
}
```

### 3. Error Response - Object (Validation):
```json
{
  "status": "error",
  "code": 400,
  "data": {
    "password": "Mật khẩu cần có ít nhất 8 ký tự, 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
    "email": "Email không hợp lệ"
  }
}
```

## Cách sử dụng trong Component:

```typescript
const MyComponent = () => {
    const { loading, error, message, executeLogin } = useAuth();
    const { setUserData } = useContext(UserContext);

    const handleLogin = async () => {
        const response = await executeLogin({
            email: "user@example.com",
            password: "password123"
        });
        
        if (response) {
            // Success - response là LoginSuccessData
            setUserData(response);
            console.log("Login thành công!");
        }
        // Error đã được xử lý trong hook và hiển thị qua error state
    };

    return (
        <div>
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            
            {/* Hiển thị error message */}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Hiển thị success message */}
            {message && <div className="alert alert-success">{message}</div>}
        </div>
    );
};
```

## Xử lý Error trong useAuth Hook:

### String Error:
- Input: `"Mật khẩu không chính xác"`
- Output: `error = "Mật khẩu không chính xác"`

### Object Error:
- Input: `{ "password": "Mật khẩu cần có ít nhất 8 ký tự...", "email": "Email không hợp lệ" }`
- Output: `error = "Mật khẩu cần có ít nhất 8 ký tự..., Email không hợp lệ"`

### Network Error:
- Input: Network failure
- Output: `error = "Lỗi kết nối mạng"`
