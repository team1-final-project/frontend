import React, { useState } from "react";
import { sendEmailCode, verifyEmailCode } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function SignupTestForm() {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    email: "",
    code: "",
    verificationToken: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    try {
      const data = await sendEmailCode(form.email);
      setMessage(data.message);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "인증코드 발송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const data = await verifyEmailCode({
        email: form.email,
        code: form.code,
      });

      setForm((prev) => ({
        ...prev,
        verificationToken: data.verification_token,
      }));
      setMessage(data.message);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "이메일 인증 실패");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!form.verificationToken) {
      setMessage("먼저 이메일 인증을 완료해주세요.");
      return;
    }

    try {
      await signup({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone || null,
        verification_token: form.verificationToken,
      });

      setMessage("회원가입 성공");
    } catch (error) {
      setMessage(error?.response?.data?.detail || "회원가입 실패");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>회원가입 테스트</h2>
      <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
      <button type="button" onClick={handleSendCode}>인증코드 발송</button>

      <input name="code" placeholder="인증코드" value={form.code} onChange={handleChange} />
      <button type="button" onClick={handleVerifyCode}>이메일 인증 확인</button>

      <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
      <input name="confirmPassword" type="password" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} />
      <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
      <input name="phone" placeholder="휴대폰 번호" value={form.phone} onChange={handleChange} />

      <button type="submit">회원가입</button>

      {message && <p>{message}</p>}
    </form>
  );
}