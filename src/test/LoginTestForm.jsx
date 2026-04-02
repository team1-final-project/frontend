import React, { useState } from "react";
import { getMe, login } from "../api/auth";
import api from "../api/axios"

const boxStyle = {
  width: "100%",
  maxWidth: 420,
  padding: 24,
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 14,
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "none",
  backgroundColor: "#111827",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

export default function LoginTestForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [me, setMe] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await login(form);
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      setMessage("로그인 성공: access/refresh token 저장 완료");
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.detail || "로그인 실패"
      );
    }
  };

  const handleGetMe = async () => {
    setMessage("");

    try {
      const data = await getMe();
      setMe(data);
      setMessage("보호 API 호출 성공");
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.detail || "보호 API 호출 실패"
      );
    }
  };

  const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await api.post("/auth/logout", {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setMe(null);
    setMessage("로그아웃 완료");
  }
};

  return (
    <div style={boxStyle}>
      <h2 style={{ marginTop: 0 }}>로그인 테스트</h2>

      <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>이메일</label>
          <input
            style={inputStyle}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>비밀번호</label>
          <input
            style={inputStyle}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
          />
        </div>

        <button type="submit" style={buttonStyle}>
          로그인
        </button>
      </form>

      <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <button
          type="button"
          onClick={handleGetMe}
          style={{ ...buttonStyle, backgroundColor: "#2563eb" }}
        >
          /auth/me 호출
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{ ...buttonStyle, backgroundColor: "#6b7280" }}
        >
          로그아웃
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 16, color: "#111827", fontSize: 14 }}>
          {message}
        </p>
      )}

      {me && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#f9fafb",
            borderRadius: 10,
            fontSize: 13,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(me, null, 2)}
        </pre>
      )}
    </div>
  );
}