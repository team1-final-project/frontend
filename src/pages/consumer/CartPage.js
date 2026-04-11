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

  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await getMyCart();
      setCartId(data.cartId);
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

  const totalPrice = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const handleToggleItem = async (id, checked) => {
    try {
      const data = await updateCartItemChecked(id, !checked);
      setCartId(data.cartId);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "선택 상태 변경에 실패했습니다.");
    }
  };

  const handleToggleAll = async () => {
    try {
      const data = await updateCartCheckAll(!isAllChecked);
      setCartId(data.cartId);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "전체 선택 변경에 실패했습니다.");
    }
  };

  const handleIncrease = async (item) => {
    try {
      const data = await updateCartItemQuantity(item.id, item.quantity + 1);
      setCartId(data.cartId);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "수량 변경에 실패했습니다.");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    try {
      const data = await updateCartItemQuantity(item.id, item.quantity - 1);
      setCartId(data.cartId);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "수량 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteCartItem(id);
      setCartId(data.cartId);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "상품 삭제에 실패했습니다.");
    }
  };

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

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

  return (
    <Page>
      <Inner>
        <Title>장바구니</Title>

        <TopBar>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={handleToggleAll}
              disabled={isLoading || cartItems.length === 0}
            />
            전체 선택
          </CheckboxLabel>
        </TopBar>

        <ListSection>
          {isLoading ? (
            <EmptyText>장바구니를 불러오는 중입니다.</EmptyText>
          ) : cartItems.length === 0 ? (
            <EmptyText>장바구니에 담긴 상품이 없습니다.</EmptyText>
          ) : (
            cartItems.map((item) => (
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
            ))
          )}
        </ListSection>

        <SummaryCard>
          <SummaryTitle>주문 요약</SummaryTitle>

          <SummaryRow>
            <span>장바구니 ID</span>
            <span>{cartId ?? "-"}</span>
          </SummaryRow>

          <SummaryRow>
            <span>선택 상품 수</span>
            <span>{selectedItems.length}개</span>
          </SummaryRow>

          <SummaryRow>
            <span>총 주문금액</span>
            <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
          </SummaryRow>

          <OrderButton type="button" onClick={handleOrder} disabled={isLoading}>
            주문하기
          </OrderButton>
        </SummaryCard>
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

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #222;
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
  border-radius: 20px;
  padding: 20px;
`;

const CheckArea = styled.div`
  flex-shrink: 0;
`;

const Thumb = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 16px;
  background: #f3efe8;
`;

const InfoArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 10px;
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
`;

const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f6f1ea;
  color: #111;
  font-size: 16px;
`;

const QtyText = styled.span`
  min-width: 20px;
  text-align: center;
  font-weight: 700;
`;

const RightArea = styled.div`
  min-width: 120px;
  text-align: right;
`;

const ItemTotal = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 14px;
`;

const DeleteButton = styled.button`
  font-size: 14px;
  color: #8a8176;
`;

const SummaryCard = styled.div`
  margin-top: 28px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 20px;
  padding: 24px;
`;

const SummaryTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin-bottom: 18px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
`;

const TotalPrice = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #111;
`;

const OrderButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-top: 16px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EmptyText = styled.p`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  color: #777;
  font-size: 16px;
`;