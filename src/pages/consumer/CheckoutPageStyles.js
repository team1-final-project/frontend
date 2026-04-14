import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f7f4ee;
  padding: 40px 24px 80px;
`;

export const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111;
  margin-bottom: 28px;
`;

export const Section = styled.section`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  border: 1px solid #eee6db;
  border-radius: 16px;
  padding: 16px;
`;

export const Thumb = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 14px;
  background: #f3efe8;
`;

export const ItemInfo = styled.div`
  flex: 1;
`;

export const ItemName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
`;

export const ItemMeta = styled.p`
  font-size: 15px;
  color: #666;
`;

export const ItemTotal = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #222;
`;

export const Input = styled.input`
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid #e5ddd2;
  border-radius: 14px;
  background: #fcfbf8;
  font-size: 15px;

  &:read-only {
    background: #f3efe8;
    color: #666;
  }
`;

export const ZipcodeRow = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ZipcodeInput = styled(Input)`
  flex: 1;
`;

export const AddressSearchButton = styled.button`
  min-width: 140px;
  height: 54px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const HelperText = styled.p`
  font-size: 13px;
  color: #7a746d;
  margin-top: 2px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 14px 16px;
  border: 1px solid #e5ddd2;
  border-radius: 14px;
  background: #fcfbf8;
  font-size: 15px;
  resize: none;
`;

export const SummaryBox = styled.div`
  margin-top: 8px;
  padding-top: 8px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  font-size: 16px;
  color: #333;
`;

export const TotalPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #111;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const SubmitButton = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 16px;
  background: #ece6dc;
  color: #111;
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const EmptyCard = styled.div`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
`;

export const BackButton = styled.button`
  margin-top: 16px;
  padding: 12px 18px;
  border-radius: 12px;
  background: #111;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
`;
