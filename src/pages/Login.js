import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import logo from "../assets/stocker-logo.svg";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const nextErrors = {
      email: "",
      password: "",
    };

    if (!form.email.trim()) {
      nextErrors.email = "이메일을 입력해주세요.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "비밀번호를 입력해주세요.";
    }

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      const data = await login(form);
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
    } catch (error) {
      console.error(error);

      const detail =
        error?.response?.data?.detail || "이메일 또는 비밀번호를 확인해주세요.";
      const lowerDetail = String(detail).toLowerCase();

      if (lowerDetail.includes("email")) {
        setFieldErrors({
          email: String(detail),
          password: "",
        });
        return;
      }

      if (lowerDetail.includes("password")) {
        setFieldErrors({
          email: "",
          password: String(detail),
        });
        return;
      }

      setFieldErrors({
        email: "이메일 또는 비밀번호를 확인해주세요.",
        password: "이메일 또는 비밀번호를 확인해주세요.",
      });
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

            <Form onSubmit={handleLogin}>
              <InputGroup>
                <Label>이메일</Label>
                <Input
                  $error={!!fieldErrors.email}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {fieldErrors.email && (
                  <ErrorText>{fieldErrors.email}</ErrorText>
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
                  placeholder="비밀번호 입력"
                />
                {fieldErrors.password && (
                  <ErrorText>{fieldErrors.password}</ErrorText>
                )}
              </InputGroup>

              <MainButton type="submit">로그인</MainButton>
            </Form>

            <SubActions>
              <TextButton type="button">아이디 찾기</TextButton>
              <Divider />
              <TextButton type="button">비밀번호 찾기</TextButton>
              <Divider />
              <TextButton type="button" onClick={() => navigate("/signup")}>
                회원가입
              </TextButton>
            </SubActions>
            <SocialRow>
              <SocialIconButton type="button">
                <FcGoogle size={30} />
              </SocialIconButton>

              <SocialIconButton type="button" $kakao>
                <RiKakaoTalkFill size={30} />
              </SocialIconButton>

              <SocialIconButton type="button" $naver>
                <SiNaver size={20} />
              </SocialIconButton>
            </SocialRow>
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
  flex-direction: column;
  align-items: center;
`;

const LogoArea = styled.div`
  width: 100%;
  max-width: 560px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 45px;
`;

const LogoImage = styled.img`
  display: block;
  width: 60%;
  max-width: 420px;
  height: auto;
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
`;

const ErrorText = styled.p`
  margin-top: -2px;
  padding-left: 4px;
  font-size: 13px;
  color: #e15b64;
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

const SubActions = styled.div`
  margin-top: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const TextButton = styled.button`
  font-size: 13px;
  color: #6d655b;
`;

const Divider = styled.span`
  width: 1px;
  height: 12px;
  background: #d8d1c8;
`;

const SocialRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 50px;
`;

const SocialIconButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #e7dfd4;
  background: ${({ $kakao, $naver }) => {
    if ($kakao) return "#FEE500";
    if ($naver) return "#03C75A";
    return "#f7f3ed";
  }};
  color: ${({ $kakao, $naver }) => {
    if ($kakao) return "#191919";
    if ($naver) return "#ffffff";
    return "#111111";
  }};
  display: flex;
  align-items: center;
  justify-content: center;
`;
