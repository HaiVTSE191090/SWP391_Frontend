import { SignUpRequest } from "../models/SignUpRequest";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const signUpApi = async (data: SignUpRequest) => {
  const res = await fetch(`${baseURL}/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Sign up failed");
  }
  return res.json();
};

export default signUpApi;
