import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderItems = location.state?.orderItems || [];
  const totalPrice = location.state?.totalPrice || 0;

  const [shippingInfo, setShippingInfo] = useState({
    receiver: "",
    phone: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !shippingInfo.receiver.trim() ||
      !shippingInfo.phone.trim() ||
      !shippingInfo.address.trim()
    ) {
      alert("받는 사람, 연락처, 주소를 입력해주세요.");
      return;
    }

    console.log("주문 상품:", orderItems);
    console.log("배송 정보:", shippingInfo);

    alert("배송지 입력까지 완료되었습니다.");
  };

  if (orderItems.length === 0) {
    return (
      <Page>
        <Inner>
          <Title>주문/결제</Title>
          <EmptyCard>
            <p>선택된 상품이 없습니다.</p>
            <BackButton type="button" onClick={() => navigate("/cart")}>
              장바구니로 돌아가기
            </BackButton>
          </EmptyCard>
        </Inner>
      </Page>
    );
  }

  return (
    <Page>
      <Inner>
        <Title>주문/결제</Title>

        <Section>
          <SectionTitle>선택 상품</SectionTitle>

          <ItemList>
            {orderItems.map((item) => (
              <ItemCard key={item.id}>
                <Thumb src={item.image} alt={item.name} />

                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemMeta>
                    {item.price.toLocaleString()}원 × {item.quantity}개
                  </ItemMeta>
                </ItemInfo>

                <ItemTotal>
                  {(item.price * item.quantity).toLocaleString()}원
                </ItemTotal>
              </ItemCard>
            ))}
          </ItemList>
        </Section>

        <Section>
          <SectionTitle>배송지 입력</SectionTitle>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="receiver">받는 사람</Label>
              <Input
                id="receiver"
                type="text"
                name="receiver"
                value={shippingInfo.receiver}
                onChange={handleChange}
                placeholder="받는 사람 이름"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                type="text"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="zipCode">우편번호</Label>
              <Input
                id="zipCode"
                type="text"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleChange}
                placeholder="우편번호"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                placeholder="기본 주소"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="detailAddress">상세 주소</Label>
              <Input
                id="detailAddress"
                type="text"
                name="detailAddress"
                value={shippingInfo.detailAddress}
                onChange={handleChange}
                placeholder="상세 주소"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="message">배송 요청사항</Label>
              <TextArea
                id="message"
                name="message"
                value={shippingInfo.message}
                onChange={handleChange}
                placeholder="배송 요청사항을 입력해주세요."
              />
            </InputGroup>

            <SummaryBox>
              <SummaryRow>
                <span>총 주문금액</span>
                <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
              </SummaryRow>

              <ButtonRow>
                <SecondaryButton
                  type="button"
                  onClick={() => navigate("/cart")}
                >
                  장바구니로 가기
                </SecondaryButton>
                <SubmitButton type="submit">입력 완료</SubmitButton>
              </ButtonRow>
            </SummaryBox>
          </Form>
        </Section>
      </Inner>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f7f4ee;
  padding: 40px 24px 80px;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111;
  margin-bottom: 28px;
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  border: 1px solid #eee6db;
  border-radius: 16px;
  padding: 16px;
`;

const Thumb = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 14px;
  background: #f3efe8;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
`;

const ItemMeta = styled.p`
  font-size: 15px;
  color: #666;
`;

const ItemTotal = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #111;
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
  height: 54px;
  padding: 0 16px;
  border: 1px solid #e5ddd2;
  border-radius: 14px;
  background: #fcfbf8;
  font-size: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 14px 16px;
  border: 1px solid #e5ddd2;
  border-radius: 14px;
  background: #fcfbf8;
  font-size: 15px;
  resize: none;
`;

const SummaryBox = styled.div`
  margin-top: 8px;
  padding-top: 8px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  font-size: 16px;
  color: #333;
`;

const TotalPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #111;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const SubmitButton = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;

const SecondaryButton = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 16px;
  background: #ece6dc;
  color: #111;
  font-size: 16px;
  font-weight: 700;
`;

const EmptyCard = styled.div`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
`;

const BackButton = styled.button`
  margin-top: 16px;
  padding: 12px 18px;
  border-radius: 12px;
  background: #111;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
`;