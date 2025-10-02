import React, { useState } from "react";
import { SignUpRequest } from "../../models/SignUpRequest";
import InputField from "../../components/common/InputField";
import AlertMessage from "../../components/common/AlertMessage";
import signUpApi from "../../services/authService";

const SignUpForm: React.FC = () => {
    const [form, setForm] = useState<SignUpRequest>({
        phone: "",
        displayName: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    //không hiểu lắm
    const updateField = (field: keyof SignUpRequest, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await signUpApi(form);
        if (result.error) {
            setError(result.message);
            setMessage("");
        } else {
            setMessage(result.message);
            setError("");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={onSubmit}>
            <InputField
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
            />
            <InputField
                placeholder="Tên hiển thị"
                value={form.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
            />
            <InputField
                type="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
            />
            <InputField
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
            />

            <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />
        </form>
        //có thể cải thiện lại cái thằng AlertMessage này sau 
    );
};

export default SignUpForm;
