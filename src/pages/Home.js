import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/stocker-logo.svg";

export default function Home() {
  const navigate = useNavigate();
  const { member, isAuthenticated, isInitializing, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Page>
      <Inner>
        <HeroCard>
          <LogoWrap>
            <Logo src={logo} alt="Stock+er" />
          </LogoWrap>
          <Desc>
            인증/인가 흐름 확인을 위한 임시 홈
          </Desc>

          {isInitializing ? (
            <StatusCard>
              <StatusTitle>초기화 중</StatusTitle>
              <StatusText>로그인 상태를 확인하고 있어.</StatusText>
            </StatusCard>
          ) : isAuthenticated ? (
            <StatusCard>
              <StatusTitle>로그인 상태</StatusTitle>
              <StatusText>
                <strong>{member?.name || "사용자"}</strong>님, 로그인됨 ㅅㄱㅇ
              </StatusText>
              <InfoList>
                <InfoItem>
                  <Label>이메일</Label>
                  <Value>{member?.email}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>권한</Label>
                  <Value>{member?.role}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>로그인 방식</Label>
                  <Value>{member?.social_type}</Value>
                </InfoItem>
              </InfoList>

              <ActionRow>
                <PrimaryButton type="button" onClick={() => navigate("/login")}>
                  로그인 페이지 보기
                </PrimaryButton>
                <SecondaryButton type="button" onClick={handleLogout}>
                  로그아웃
                </SecondaryButton>
                <SecondaryButton type="button" onClick={() => navigate("/toss")}>
                  토스 테스트 결제 페이지
                </SecondaryButton>
                <SecondaryButton type="button" onClick={() => navigate("/product-detail")}>
                  제품 상세 정보 테스트 페이지
                </SecondaryButton>
              </ActionRow>
            </StatusCard>
          ) : (
            <StatusCard>
              <StatusTitle>비로그인 상태</StatusTitle>
              <StatusText>
                로그인 / 회원가입 / 소셜 로그인 흐름 확인용 임시 홈
              </StatusText>

              <ActionRow>
                <PrimaryButton type="button" onClick={() => navigate("/login")}>
                  로그인
                </PrimaryButton>
                <SecondaryButton type="button" onClick={() => navigate("/signup")}>
                  회원가입
                </SecondaryButton>
              </ActionRow>
            </StatusCard>
          )}
        </HeroCard>
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
  align-items: center;
  justify-content: center;
`;

const HeroCard = styled.section`
  width: 100%;
  max-width: 920px;
  background: #ffffff;
  border-radius: 36px;
  padding: 56px 48px;
  box-shadow: 0 20px 60px rgba(25, 25, 25, 0.08);
  border: 1px solid #eee7dd;
`;

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
`;

const Logo = styled.img`
  width: min(360px, 60%);
  height: auto;
`;

const Desc = styled.p`
  margin-top: 14px;
  color: #6f675d;
  font-size: 16px;
  line-height: 1.7;
`;

const StatusCard = styled.div`
  margin-top: 28px;
  border-radius: 24px;
  background: #fcfbf8;
  border: 1px solid #ede4d8;
  padding: 28px 24px;
`;

const StatusTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #111111;
`;

const StatusText = styled.p`
  margin-top: 10px;
  color: #6f675d;
  font-size: 15px;
  line-height: 1.6;
`;

const InfoList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e8dfd3;
  padding: 18px 16px;
`;

const Label = styled.div`
  color: #8b8175;
  font-size: 13px;
  font-weight: 700;
`;

const Value = styled.div`
  margin-top: 8px;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
  word-break: break-all;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  min-width: 160px;
  height: 52px;
  border-radius: 18px;
  background: #111111;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

const SecondaryButton = styled.button`
  min-width: 160px;
  height: 52px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #ddd2c4;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
`;