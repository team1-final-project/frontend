import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SocialLoginCallback() {
  const navigate = useNavigate();
  const { completeSocialLogin } = useAuth();
  const [message, setMessage] = useState("소셜 로그인 처리 중입니다.");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
          setMessage("로그인 토큰이 없습니다.");
          return;
        }

        await completeSocialLogin({
          accessToken,
          refreshToken,
        });

        navigate("/", { replace: true });
      } catch (error) {
        console.error(error);
        setMessage("소셜 로그인 처리에 실패했습니다.");
      }
    };

    run();
  }, [completeSocialLogin, navigate]);

  return (
    <Page>
      <Card>
        <Title>{message}</Title>
        <Desc>잠시만 기다리면 홈 화면으로 이동해.</Desc>
      </Card>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f4f1eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 28px;
  padding: 40px 32px;
  box-shadow: 0 18px 50px rgba(25, 25, 25, 0.08);
  border: 1px solid #eee7dd;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #111111;
`;

const Desc = styled.p`
  margin-top: 12px;
  color: #6f675d;
  font-size: 15px;
`;