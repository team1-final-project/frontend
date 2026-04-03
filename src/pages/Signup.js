import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { sendEmailCode, verifyEmailCode } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/stocker-logo.svg";

export default function Signup() {
  const navigate = useNavigate();
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

  const [isSendingCode, setIsSendingCode] = useState(false);

  const isEmailVerified = !!form.verificationToken;

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  const [fieldMessages, setFieldMessages] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "code") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => {
      const nextForm = {
        ...prev,
        [name]: nextValue,
      };

      if (name === "email" || name === "code") {
        nextForm.verificationToken = "";
      }

      return nextForm;
    });

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "email" || name === "code") {
      setFieldMessages((prev) => ({
        ...prev,
        email: "",
      }));
    }
  };

  const handleSendCode = async () => {
    setFieldErrors((prev) => ({
      ...prev,
      email: "",
    }));

    setFieldMessages((prev) => ({
      ...prev,
      email: "",
    }));

    if (!form.email.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "이메일을 입력해주세요.",
      }));
      return;
    }

    try {
      setIsSendingCode(true);

      setFieldMessages((prev) => ({
        ...prev,
        email: "인증코드 발송 중입니다...",
      }));

      const data = await sendEmailCode(form.email.trim());

      setFieldMessages((prev) => ({
        ...prev,
        email: data?.message || "인증코드 발송을 요청했습니다.",
      }));
    } catch (error) {
      console.error(error);
      setFieldErrors((prev) => ({
        ...prev,
        email: error?.response?.data?.detail || "인증코드 발송 실패",
      }));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setFieldErrors((prev) => ({
      ...prev,
      code: "",
    }));

    setFieldMessages((prev) => ({
      ...prev,
      code: "",
      email: "",
    }));

    if (!form.email.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "이메일을 먼저 입력해주세요.",
      }));
      return;
    }

    if (!form.code.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        code: "인증번호를 입력해주세요.",
      }));
      return;
    }

    try {
      const data = await verifyEmailCode({
        email: form.email.trim(),
        code: form.code.trim(),
      });

      setForm((prev) => ({
        ...prev,
        verificationToken: data.verification_token,
      }));

      setFieldMessages((prev) => ({
        ...prev,
        email: "이메일 인증이 완료되었습니다.",
        code: "",
      }));
    } catch (error) {
      console.error(error);
      setForm((prev) => ({
        ...prev,
        verificationToken: "",
      }));
      setFieldErrors((prev) => ({
        ...prev,
        code: error?.response?.data?.detail || "이메일 인증 실패",
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const nextErrors = {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    };

    if (!form.email.trim()) nextErrors.email = "이메일을 입력해주세요.";
    if (!form.code.trim()) nextErrors.code = "인증번호를 입력해주세요.";
    if (!form.verificationToken) {
      nextErrors.code = nextErrors.code || "이메일 인증을 완료해주세요.";
    }
    if (!form.password.trim()) nextErrors.password = "비밀번호를 입력해주세요.";
    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    }
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword = "비밀번호 확인이 일치하지 않습니다.";
    }
    if (!form.name.trim()) nextErrors.name = "이름을 입력해주세요.";
    if (!form.phone.trim()) nextErrors.phone = "연락처를 입력해주세요.";

    const hasError = Object.values(nextErrors).some(Boolean);

    if (hasError) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      await signup({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        verification_token: form.verificationToken,
      });

      window.alert("회원가입이 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data?.detail || "회원가입 실패";

      setFieldErrors((prev) => ({
        ...prev,
        email: String(detail),
      }));
    }
  };

  return (
    <Page>
      <Inner>
        <FormSection>
          <FormCard>
            <LogoArea>
              <LogoImage src={logo} alt="Stock+er" />
            </LogoArea>

            <Form onSubmit={handleSignup}>
              <InputGroup>
                <Label>이메일</Label>

                {isEmailVerified ? (
                  <Input
                    $error={!!fieldErrors.email}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    disabled
                  />
                ) : (
                  <InlineRow>
                    <Input
                      $error={!!fieldErrors.email}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                    />
                    <SmallButton
                      type="button"
                      onClick={handleSendCode}
                      disabled={isSendingCode}
                    >
                      {isSendingCode ? "발송 중..." : "인증 발송"}
                    </SmallButton>
                  </InlineRow>
                )}

                {fieldErrors.email && <ErrorText>{fieldErrors.email}</ErrorText>}
                {!fieldErrors.email && fieldMessages.email && (
                  <SuccessText>{fieldMessages.email}</SuccessText>
                )}
              </InputGroup>

              {!isEmailVerified && (
                <InputGroup>
                  <Label>이메일 인증번호</Label>
                  <InlineRow>
                    <Input
                      $error={!!fieldErrors.code}
                      type="text"
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="인증번호 입력"
                    />
                    <SmallButton type="button" onClick={handleVerifyCode}>
                      인증 확인
                    </SmallButton>
                  </InlineRow>
                  {fieldErrors.code && <ErrorText>{fieldErrors.code}</ErrorText>}
                </InputGroup>
              )}

              <InputGroup>
                <Label>비밀번호</Label>
                <Input
                  $error={!!fieldErrors.password}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호"
                />
                {fieldErrors.password && (
                  <ErrorText>{fieldErrors.password}</ErrorText>
                )}
              </InputGroup>

              <InputGroup>
                <Label>비밀번호 확인</Label>
                <Input
                  $error={!!fieldErrors.confirmPassword}
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호 확인"
                />
                {fieldErrors.confirmPassword && (
                  <ErrorText>{fieldErrors.confirmPassword}</ErrorText>
                )}
              </InputGroup>

              <InputGroup>
                <Label>이름</Label>
                <Input
                  $error={!!fieldErrors.name}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="이름"
                />
                {fieldErrors.name && <ErrorText>{fieldErrors.name}</ErrorText>}
              </InputGroup>

              <InputGroup>
                <Label>연락처</Label>
                <Input
                  $error={!!fieldErrors.phone}
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01012345678"
                />
                {fieldErrors.phone && (
                  <ErrorText>{fieldErrors.phone}</ErrorText>
                )}
              </InputGroup>

              <MainButton type="submit">
                회원가입
              </MainButton>
            </Form>

            <BottomRow>
              <BottomText>이미 계정이 있나요?</BottomText>
              <BottomLink type="button" onClick={() => navigate("/login")}>
                로그인
              </BottomLink>
            </BottomRow>
          </FormCard>
        </FormSection>
      </Inner>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f4f1eb;
  padding: 40px 24px;
`;

const Inner = styled.div`
  max-width: 1280px;
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormSection = styled.div`
  width: 600px;
  display: flex;
  justify-content: center;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border-radius: 32px;
  padding: 40px 32px;
  box-shadow: 0 18px 50px rgba(25, 25, 25, 0.08);
  border: 1px solid #eee7dd;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #222;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border-radius: 16px;
  border: 1px solid ${({ $error }) => ($error ? "#e15b64" : "#e5ddd2")};
  background: #fcfbf8;
  font-size: 15px;
  color: #111;

  &::placeholder {
    color: #a59a8d;
  }

  &:focus {
    border-color: ${({ $error }) => ($error ? "#e15b64" : "#111")};
    background: #fff;
  }

  &:disabled {
    background: #f1ede6;
    color: #8f8477;
    cursor: not-allowed;
  }
`;

const InlineRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 118px;
  gap: 10px;
`;

const ErrorText = styled.p`
  margin-top: -2px;
  padding-left: 4px;
  font-size: 13px;
  color: #e15b64;
`;

const SuccessText = styled.p`
  margin-top: -2px;
  padding-left: 4px;
  font-size: 13px;
  color: #0f766e;
`;

const SmallButton = styled.button`
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 13px;
  font-weight: 700;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const MainButton = styled.button`
  width: 100%;
  height: 58px;
  border-radius: 18px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-top: 6px;
`;

const BottomRow = styled.div`
  margin-top: 22px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const BottomText = styled.span`
  font-size: 14px;
  color: #6d655b;
`;

const BottomLink = styled.button`
  font-size: 14px;
  font-weight: 700;
  color: #111;
`;

const LogoArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 46px;
`;

const LogoImage = styled.img`
  display: block;
  width: 60%;
  max-width: 420px;
  height: auto;
`;