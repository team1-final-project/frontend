import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Menu, Search, ShoppingCart, CircleUserRound } from "lucide-react";
import logo from "../assets/stocker-logo.svg";

export default function Header() {
  return (
    <HeaderWrap>
      <Inner>
        <LeftArea>
          <MenuButton type="button">
            <Menu size={22} />
          </MenuButton>

          <BrandLogoLink to="/">
            <BrandLogoImage src={logo} alt="STOCK+er" />
          </BrandLogoLink>

          <Nav>
            <NavItem href="/">Best</NavItem>
            <NavItem href="/">Sales</NavItem>
            <NavItem href="/">Hot Deal</NavItem>
            <NavItem href="/">New Arrivals</NavItem>
          </Nav>
        </LeftArea>

        <RightArea>
          <SearchBox>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput placeholder="Search for products..." />
          </SearchBox>

          <IconGroup>
            <IconButton type="button">
              <ShoppingCart size={20} />
            </IconButton>
            <IconButton type="button">
              <CircleUserRound size={20} />
            </IconButton>
          </IconGroup>
        </RightArea>
      </Inner>
    </HeaderWrap>
  );
}

const BrandLogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 12px;
`;

const BrandLogoImage = styled.img`
  height: 32px;
  width: auto;
  display: block;
`;

const HeaderWrap = styled.header`
  width: 100%;
  height: 58px;
  background: #ffffff;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
`;

const MenuButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #111;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 22px;
  margin-left: 6px;

  @media (max-width: 980px) {
    display: none;
  }
`;

const NavItem = styled.a`
  text-decoration: none;
  color: #222;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    color: #000;
  }
`;

const RightArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  min-width: 0;
`;

const SearchBox = styled.div`
  width: 100%;
  max-width: 460px;
  height: 40px;
  border-radius: 999px;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #111;

  &::placeholder {
    color: #9b9b9b;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
  cursor: pointer;
`;
