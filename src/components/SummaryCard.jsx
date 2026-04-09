import React from "react";
import styled from "styled-components";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function SummaryCard({
  title,
  subText,
  value,
  change,
  up = true,
}) {
  return (
    <Card>
      <Title>{title}</Title>
      <SubText>{subText}</SubText>
      <Value>{value}</Value>

      <Footer $up={up}>
        {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {change} <span>vs last 7 days</span>
      </Footer>
    </Card>
  );
}

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  min-height: 118px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const Title = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const SubText = styled.div`
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
`;

const Value = styled.div`
  margin-top: 14px;
  color: #111827;
  font-size: 34px;
  font-weight: 800;
`;

const Footer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $up }) => ($up ? "#22c55e" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;

  span {
    color: #9ca3af;
    font-weight: 500;
    margin-left: 2px;
  }
`;
