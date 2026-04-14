import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f7f4ee;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 36px 24px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111;
  margin-bottom: 16px;
`;

export const Description = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #666;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export const BaseButton = styled.button`
  flex: 1;
  height: 54px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
`;

export const PrimaryButton = styled(BaseButton)`
  background: #111;
  color: #fff;
`;

export const SecondaryButton = styled(BaseButton)`
  background: #ece6dc;
  color: #111;
`;
