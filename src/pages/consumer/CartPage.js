import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  deleteCartItem,
  getMyCart,
  updateCartCheckAll,
  updateCartItemChecked,
  updateCartItemQuantity,
} from "../../api/cart";

export default function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await getMyCart();
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "장바구니 조회에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const isAllChecked = useMemo(() => {
    return cartItems.length > 0 && cartItems.every((item) => item.checked);
  }, [cartItems]);

  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => item.checked);
  }, [cartItems]);

  const selectedCount = selectedItems.length;

  const totalPrice = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const handleToggleItem = async (id, checked) => {
    try {
      const data = await updateCartItemChecked(id, !checked);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "선택 상태 변경에 실패했습니다.");
    }
  };

  const handleToggleAll = async () => {
    try {
      const data = await updateCartCheckAll(!isAllChecked);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "전체 선택 변경에 실패했습니다.");
    }
  };

  const handleIncrease = async (item) => {
    try {
      const data = await updateCartItemQuantity(item.id, item.quantity + 1);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "수량 변경에 실패했습니다.");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    try {
      const data = await updateCartItemQuantity(item.id, item.quantity - 1);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "수량 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteCartItem(id);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "상품 삭제에 실패했습니다.");
    }
  };

  const handleOrder = () => {
    if (selectedItems.length === 0) return;

    navigate("/checkoutPage", {
      state: {
        orderItems: selectedItems.map((item) => ({
          id: item.id,
          cartItemId: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalPrice,
      },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <StateCard>장바구니를 불러오는 중입니다.</StateCard>;
    }

    if (cartItems.length === 0) {
      return (
        <EmptyWrap>
          <EmptyCard>
            <EmptyTitle>장바구니가 비어 있어요</EmptyTitle>
            <EmptyDescription>
              원하는 상품을 담아 주문을 시작해보세요.
            </EmptyDescription>
            <EmptyButton type="button" onClick={() => navigate("/")}>
              쇼핑 계속하기
            </EmptyButton>
          </EmptyCard>
        </EmptyWrap>
      );
    }

    return (
      <ContentGrid>
        <LeftColumn>
          <TopBar>
            <TopBarLeft>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleToggleAll}
                  disabled={isLoading || cartItems.length === 0}
                />
                전체 선택
              </CheckboxLabel>
              <SelectedMeta>
                선택된 상품 <strong>{selectedCount}</strong>개
              </SelectedMeta>
            </TopBarLeft>
          </TopBar>

          <ListSection>
            {cartItems.map((item) => (
              <CartCard key={item.id}>
                <CheckArea>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleItem(item.id, item.checked)}
                  />
                </CheckArea>

                <Thumb
                  src={item.image || "https://via.placeholder.com/120"}
                  alt={item.name}
                />

                <InfoArea>
                  <ProductName>{item.name}</ProductName>
                  <ProductPrice>{item.price.toLocaleString()}원</ProductPrice>

                  <QuantityBox>
                    <QtyButton
                      type="button"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </QtyButton>
                    <QtyText>{item.quantity}</QtyText>
                    <QtyButton
                      type="button"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </QtyButton>
                  </QuantityBox>
                </InfoArea>

                <RightArea>
                  <ItemTotal>
                    {(item.price * item.quantity).toLocaleString()}원
                  </ItemTotal>
                  <DeleteButton
                    type="button"
                    onClick={() => handleDelete(item.id)}
                  >
                    삭제
                  </DeleteButton>
                </RightArea>
              </CartCard>
            ))}
          </ListSection>
        </LeftColumn>

        <RightColumn>
          <SummaryCard>
            <SummaryTitle>주문 요약</SummaryTitle>

            <SummaryRow>
              <span>선택 상품 수</span>
              <span>{selectedCount}개</span>
            </SummaryRow>

            <SummaryRow>
              <span>총 주문금액</span>
              <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
            </SummaryRow>

            <OrderButton
              type="button"
              onClick={handleOrder}
              disabled={isLoading || selectedCount === 0}
            >
              {selectedCount === 0 ? "상품을 선택해주세요" : "주문하기"}
            </OrderButton>
          </SummaryCard>
        </RightColumn>
      </ContentGrid>
    );
  };

  return (
    <Page>
      <Inner>
        <Title>장바구니</Title>
        {renderContent()}
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
  max-width: 1180px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #111;
  margin-bottom: 28px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  min-width: 0;
`;

const RightColumn = styled.div`
  position: sticky;
  top: 92px;

  @media (max-width: 980px) {
    position: static;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #222;
  font-weight: 600;
`;

const SelectedMeta = styled.div`
  font-size: 14px;
  color: #6f675d;

  strong {
    color: #111;
    font-weight: 800;
  }
`;

const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartCard = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 22px;
  padding: 20px;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

const CheckArea = styled.div`
  flex-shrink: 0;
  padding-top: 4px;
`;

const Thumb = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 16px;
  background: #f3efe8;
  flex-shrink: 0;

  @media (max-width: 680px) {
    width: 96px;
    height: 96px;
  }
`;

const InfoArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #111;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const ProductPrice = styled.p`
  font-size: 15px;
  color: #555;
  margin-bottom: 16px;
`;

const QuantityBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #ddd3c6;
  border-radius: 12px;
  padding: 8px 12px;
  background: #fff;
`;

const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f6f1ea;
  color: #111;
  font-size: 16px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const QtyText = styled.span`
  min-width: 20px;
  text-align: center;
  font-weight: 800;
`;

const RightArea = styled.div`
  min-width: 120px;
  text-align: right;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 680px) {
    width: 100%;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
  }
`;

const ItemTotal = styled.p`
  font-size: 20px;
  font-weight: 800;
  color: #111;
`;

const DeleteButton = styled.button`
  font-size: 14px;
  color: #8a8176;
  align-self: flex-end;

  @media (max-width: 680px) {
    align-self: auto;
  }
`;

const SummaryCard = styled.div`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 22px;
  padding: 24px;
  margin-top: 40px;
`;

const SummaryTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #111;
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 16px;
  color: #333;
`;

const TotalPrice = styled.span`
  font-size: 24px;
  font-weight: 900;
  color: #111;
`;

const OrderButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  margin-top: 18px;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const StateCard = styled.div`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 22px;
  padding: 44px 24px;
  text-align: center;
  color: #777;
  font-size: 16px;
`;

const EmptyWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const EmptyCard = styled.div`
  width: 100%;
  max-width: 640px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 54px 24px;
  text-align: center;
`;

const EmptyTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #111;
  margin-bottom: 12px;
`;

const EmptyDescription = styled.p`
  font-size: 15px;
  color: #6f675d;
  line-height: 1.7;
  margin-bottom: 24px;
`;

const EmptyButton = styled.button`
  min-width: 180px;
  height: 54px;
  padding: 0 20px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
`;