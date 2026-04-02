import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { sendEmailCode, signup, verifyEmailCode } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    name: "",
    rrnFront: "",
    rrnBack: "",
    phone: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    rrnFront: "",
    rrnBack: "",
  });

  const [fieldMessages, setFieldMessages] = useState({
    email: "",
    code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "rrnFront") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    }

    if (name === "rrnBack") {
      nextValue = value.replace(/\D/g, "").slice(0, 1);
    }

    if (name === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "code") {
      nextValue = value.replace(/\D/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "email" || name === "code") {
      setFieldMessages((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "email" || name === "code") {
      setIsEmailVerified(false);
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
      const data = await sendEmailCode(form.email);
      setFieldMessages((prev) => ({
        ...prev,
        email: data?.message || "인증코드를 발송했습니다.",
      }));
    } catch (error) {
      console.error(error);
      setFieldErrors((prev) => ({
        ...prev,
        email: error?.response?.data?.detail || "인증코드 발송 실패",
      }));
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
        email: form.email,
        code: form.code,
      });

      setIsEmailVerified(true);
      setFieldMessages((prev) => ({
        ...prev,
        code: data?.message || "이메일 인증이 완료되었습니다.",
      }));
    } catch (error) {
      console.error(error);
      setIsEmailVerified(false);
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
      rrnFront: "",
      rrnBack: "",
    };

    if (!form.email.trim()) nextErrors.email = "이메일을 입력해주세요.";
    if (!form.code.trim()) nextErrors.code = "인증번호를 입력해주세요.";
    if (!isEmailVerified)
      nextErrors.code = nextErrors.code || "이메일 인증을 완료해주세요.";
    if (!form.password.trim()) nextErrors.password = "비밀번호를 입력해주세요.";
    if (!form.confirmPassword.trim())
      nextErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword = "비밀번호 확인이 일치하지 않습니다.";
    }
    if (!form.name.trim()) nextErrors.name = "이름을 입력해주세요.";
    if (!form.phone.trim()) nextErrors.phone = "연락처를 입력해주세요.";
    if (form.rrnFront.length !== 6)
      nextErrors.rrnFront = "앞 6자리를 입력해주세요.";
    if (form.rrnBack.length !== 1)
      nextErrors.rrnBack = "뒤 1자리를 입력해주세요.";

    const hasError = Object.values(nextErrors).some(Boolean);

    if (hasError) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone || null,
        is_email_verified: isEmailVerified,
      };

      const data = await signup(payload);
      window.alert(data?.message || "회원가입 성공");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data?.detail || "회원가입 실패";

      if (String(detail).toLowerCase().includes("email")) {
        setFieldErrors((prev) => ({
          ...prev,
          email: String(detail),
        }));
        return;
      }

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
            <CardHeader>
              <LogoText>Create Account</LogoText>
              <CardTitle>회원가입</CardTitle>
            </CardHeader>

            <Form onSubmit={handleSignup}>
              <InputGroup>
                <Label>이메일</Label>
                <InlineRow>
                  <Input
                    $error={!!fieldErrors.email}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />
                  <SmallButton type="button" onClick={handleSendCode}>
                    인증 발송
                  </SmallButton>
                </InlineRow>
                {fieldErrors.email && (
                  <ErrorText>{fieldErrors.email}</ErrorText>
                )}
                {!fieldErrors.email && fieldMessages.email && (
                  <SuccessText>{fieldMessages.email}</SuccessText>
                )}
              </InputGroup>

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
                {!fieldErrors.code && fieldMessages.code && (
                  <SuccessText>{fieldMessages.code}</SuccessText>
                )}
              </InputGroup>

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

              <DoubleRow>
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
                  {fieldErrors.name && (
                    <ErrorText>{fieldErrors.name}</ErrorText>
                  )}
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
              </DoubleRow>

              <InputGroup>
                <Label>주민등록번호</Label>
                <ResidentRow>
                  <ResidentHalf>
                    <Input
                      $error={!!fieldErrors.rrnFront}
                      type="text"
                      name="rrnFront"
                      value={form.rrnFront}
                      onChange={handleChange}
                      placeholder="앞 6자리"
                      maxLength={6}
                    />
                  </ResidentHalf>

                  <Dash>-</Dash>

                  <ResidentHalf>
                    <BackPart>
                      <BackDigitInput
                        $error={!!fieldErrors.rrnBack}
                        type="password"
                        name="rrnBack"
                        value={form.rrnBack}
                        onChange={handleChange}
                        maxLength={1}
                      />
                      <MaskedBox>●●●●●●</MaskedBox>
                    </BackPart>
                  </ResidentHalf>
                </ResidentRow>

                {fieldErrors.rrnFront && (
                  <ErrorText>{fieldErrors.rrnFront}</ErrorText>
                )}
                {!fieldErrors.rrnFront && fieldErrors.rrnBack && (
                  <ErrorText>{fieldErrors.rrnBack}</ErrorText>
                )}
              </InputGroup>

              <MainButton type="submit">회원가입</MainButton>
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

const CardHeader = styled.div`
  margin-bottom: 28px;
`;

const LogoText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #8d8478;
  margin-bottom: 8px;
`;

const CardTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #111;
  margin-bottom: 10px;
`;

const CardDesc = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #6f675d;
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
`;

const InlineRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 118px;
  gap: 10px;
`;

const DoubleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ResidentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
`;

const ResidentHalf = styled.div`
  width: 100%;
`;

const BackPart = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 8px;
  align-items: center;
`;

const BackDigitInput = styled(Input)`
  padding: 0;
  text-align: center;
`;

const MaskedBox = styled.div`
  height: 56px;
  border-radius: 16px;
  border: 1px solid #e5ddd2;
  background: #f4efe8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f8477;
  font-size: 14px;
  letter-spacing: 3px;
`;

const Dash = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #666;
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
