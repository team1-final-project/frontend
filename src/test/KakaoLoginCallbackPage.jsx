import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function KakaoLoginCallbackPage() {
  const { completeGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("카카오 로그인 처리 중입니다.");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
          setMessage("토큰이 없습니다.");
          return;
        }

        await completeGoogleLogin({
          accessToken,
          refreshToken,
        });

        setMessage("카카오 로그인 완료");
        navigate("/", { replace: true });
      } catch (error) {
        console.error(error);
        setMessage("카카오 로그인 처리에 실패했습니다.");
      }
    };

    run();
  }, [completeGoogleLogin, navigate]);

  return (
    <div style={{ padding: 40 }}>
      <h2>{message}</h2>
    </div>
  );
}