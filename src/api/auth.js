import api from "./axios";

// 현재 FastAPI JWT 로그인 테스트용
// 백엔드가 OAuth2PasswordRequestForm 받는 구조면
// username 자리에 email을 넣어서 보냄
export const login = async ({ email, password }) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

// 회원가입 API
export const signup = async (payload) => {
  const response = await api.post("/auth/signup", payload);
  return response.data;
};

// 보호 API 확인용
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// 리프레쉬 토큰
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const response = await api.post("/auth/refresh", {
    refresh_token: refreshToken,
  });

  return response.data;
};

// 이메일 인증코드 발송
export const sendEmailVerification = async (email) => {
  const response = await api.post("/auth/email/send-code", { email });
  return response.data;
};

// 이메일 인증코드 확인
export const verifyEmailCode = async ({ email, code }) => {
  const response = await api.post("/auth/email/verify-code", { email, code });
  return response.data;
};

// 소셜 로그인 시작 URL
export const getGoogleLoginUrl = () => "/api/v1/auth/google/login";
export const getKakaoLoginUrl = () => "/api/v1/auth/kakao/login";
export const getNaverLoginUrl = () => "/api/v1/auth/naver/login";