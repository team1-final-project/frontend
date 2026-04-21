import React from "react";
import styled, { css } from "styled-components";
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  variant = "default",
}) {
  return (
    <SearchWrap $variant={variant}>
      <SearchInput
        $variant={variant}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <SearchIcon>
        <Search size={15} />
      </SearchIcon>
    </SearchWrap>
  );
}

const SearchWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: ${({ $variant }) =>
    $variant === "inventory" ? "224px" : "240px"};
  box-shadow: var(--shadow);
  border-radius: 10px;

  @media (max-width: 900px) {
    max-width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  outline: none;
  border: 1px solid transparent;
  transition: all 0.2s;

  &::placeholder {
    color: var(--placeholder);
  }

  &:focus {
    border-color: var(--focus-border);
  }

  ${({ $variant }) =>
    $variant === "inventory"
      ? css`
          height: 44px;
          padding: 0 36px 0 14px;
        `
      : css`
          height: 38px;
          padding: 0 34px 0 14px;
        `}
`;
