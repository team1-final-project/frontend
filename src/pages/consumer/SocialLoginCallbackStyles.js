import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f4f1eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 30px 200px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 28px;
  padding: 40px 32px;
  box-shadow: 0 18px 50px rgba(25, 25, 25, 0.08);
  border: 1px solid #eee7dd;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #111111;
`;

export const Desc = styled.p`
  margin-top: 12px;
  color: #6f675d;
  font-size: 15px;
`;
