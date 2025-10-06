import React, { useState } from 'react';
import { signUpApi } from '../../services/authService';
import { SignUpRequest } from '../../models/AuthModel';

const SignUp: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data: SignUpRequest = {
            phone, displayName, password, confirmPassword
        };

        const obj = await signUpApi(data);

        if (obj.error) {
            setMessage(obj.message || "Đăng ký thành công!");
            setError("");
        } else {
            setError(obj.message || "Đăng ký thất bại!");
            setMessage("");
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>

            <div className="modal fade show d-block" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {/* Header */}
                        <div className="modal-header ">
                            <h6 className="modal-title w-100 text-center fw-bold fs-3">Đăng ký</h6>
                            <button
                                type="button"
                                className="btn-close"
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} method='post'>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Số điện thoại"
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tên hiển thị"
                                        onChange={e => setDisplayName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Mật khẩu"
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Xác nhận mật khẩu"
                                        onChange={e => { setConfirmPassword(e.target.value) }}

                                    />
                                </div>

                                <div className="form-check mb-4">
                                    <input className="form-check-input border border-dark" type="checkbox" id="agree" />
                                    <label className="form-check-label" htmlFor="agree">
                                        Tôi đã đọc và đồng ý với{" "}
                                        <a href="#">Chính sách & quy định</a>
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-success w-100">
                                    Đăng ký
                                </button>
                                <div className="d-flex justify-content-center mt-3">
                                    <button type="button" className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2">
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
                                        <span>Google</span>
                                    </button>
                                </div>
                                <div>
                                    {message && (
                                        <div className="alert alert-success text-center" role="alert">
                                            {message}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="alert alert-danger text-center" role="alert">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default SignUp;
