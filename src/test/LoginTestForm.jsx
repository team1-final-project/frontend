import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginTestForm() {
  const { login, logout, member } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      setMessage("로그인 성공");
    } catch (error) {
      setMessage(error?.response?.data?.detail || "로그인 실패");
    }
  };

  const handleLogout = async () => {
    await logout();
    setMessage("로그아웃 완료");
  };

  return (
    <div>
      <h2>로그인 테스트</h2>
      <form onSubmit={handleLogin}>
        <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
        <button type="submit">로그인</button>
      </form>

      <button type="button" onClick={handleLogout}>로그아웃</button>

      {message && <p>{message}</p>}
      {member && <pre>{JSON.stringify(member, null, 2)}</pre>}
    </div>
  );
}