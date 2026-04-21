import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { createGlobalStyle, css } from "styled-components";
import { Calendar } from "lucide-react";

const DatePickerGlobalStyle = createGlobalStyle`
  .react-datepicker-wrapper { width: auto; }
  .react-datepicker { font-family: inherit; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .react-datepicker__header { background: white; border-bottom: 1px solid var(--border); }
  .react-datepicker__day--selected { background-color: var(--blue) !important; border-radius: 8px; }
`;

export default function SearchDate({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  variant = "default",
}) {
  const sDate = startDate ? new Date(startDate) : null;
  const eDate = endDate ? new Date(endDate) : null;

  return (
    <>
      <DatePickerGlobalStyle />
      <DateFilterGroup>
        <DatePickerContainer $variant={variant}>
          <DatePicker
            selected={sDate}
            onChange={(date) =>
              onStartDateChange(date ? date.toISOString().split("T")[0] : "")
            }
            placeholderText="시작일"
            dateFormat="yyyy-MM-dd"
            className="custom-datepicker"
          />
          <Calendar size={14} className="calendar-icon" />
        </DatePickerContainer>

        <DateDivider>~</DateDivider>

        <DatePickerContainer $variant={variant}>
          <DatePicker
            selected={eDate}
            onChange={(date) =>
              onEndDateChange(date ? date.toISOString().split("T")[0] : "")
            }
            placeholderText="종료일"
            dateFormat="yyyy-MM-dd"
            className="custom-datepicker"
            minDate={sDate} // 시작일보다 앞선 날짜 선택 방지
          />
          <Calendar size={14} className="calendar-icon" />
        </DatePickerContainer>
      </DateFilterGroup>
    </>
  );
}

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateDivider = styled.span`
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 600;
`;

const DatePickerContainer = styled.div`
  position: relative;
  box-shadow: var(--shadow);
  border-radius: 10px;

  .calendar-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--placeholder);
    pointer-events: none;
    z-index: 1;
  }

  .custom-datepicker {
    width: 130px;
    height: ${({ $variant }) => ($variant === "inventory" ? "44px" : "38px")};
    padding: 0 34px 0 12px;
    border-radius: 10px;
    border: 1px solid transparent;
    background: white;
    color: var(--font);
    font-size: 13px;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: var(--focus-border);
    }
  }
`;
