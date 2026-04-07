import React from "react";
import styled, { css } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import logo from "../assets/stocker-logo.svg";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  return (
    <HeaderWrap>
      <Inner>
        <LeftArea>
          <MenuButton type="button">
            <Menu size={25} />
          </MenuButton>

          <BrandLogoLink to="/">
            <BrandLogoImage src={logo} alt="STOCK+er" />
          </BrandLogoLink>

          <Nav>
            <NavItem to="/">Best</NavItem>
            <NavItem to="/">Sales</NavItem>
            <NavItem to="/">Hot Deal</NavItem>
            <NavItem to="/">New Arrivals</NavItem>
          </Nav>
        </LeftArea>

        <RightArea>
          <SearchBox>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput placeholder="Search for products..." />
          </SearchBox>

          <ActionGroup $isAuthenticated={isAuthenticated}>
            {!isInitializing &&
              (isAuthenticated ? (
                <>
                  <GhostActionLink to="/cart">장바구니</GhostActionLink>
                  <GhostActionLink to="/profile">프로필</GhostActionLink>
                  <LogoutButton type="button" onClick={handleLogout}>
                    로그아웃
                  </LogoutButton>
                </>
              ) : (
                <>
                  <GhostActionLink to="/login">로그인</GhostActionLink>
                  <PrimaryActionLink to="/signup">회원가입</PrimaryActionLink>
                </>
              ))}
          </ActionGroup>
        </RightArea>
      </Inner>
    </HeaderWrap>
  );
}

const HeaderWrap = styled.header`
  width: 100%;
  height: 68px;
  background: #ffffff;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
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
  flex-shrink: 0;
`;

const BrandLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
`;

const BrandLogoImage = styled.img`
  height: 24px;
  width: auto;
  display: block;
  object-fit: contain;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 10px;

  @media (max-width: 980px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: #222;
  font-size: 15px;
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
  gap: 18px;
  min-width: 0;
`;

const SearchBox = styled.div`
  width: 100%;
  max-width: 500px;
  height: 42px;
  border-radius: 999px;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  padding: 0 18px;
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  margin-right: 9px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #111;

  &::placeholder {
    color: #9b9b9b;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  min-width: ${({ $isAuthenticated }) =>
    $isAuthenticated ? "280px" : "200px"};
  justify-content: ${({ $isAuthenticated }) =>
    $isAuthenticated ? "flex-end" : "flex-end"};

  @media (max-width: 980px) {
    display: none;
  }
`;

const buttonBase = css`
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: all 0.2s ease;
`;

const GhostActionLink = styled(Link)`
  ${buttonBase}
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #222;

  &:hover {
    background: #f8f8f8;
  }
`;

const PrimaryActionLink = styled(Link)`
  ${buttonBase}
  border: 1px solid #111;
  background: #111;
  color: #fff;

  &:hover {
    opacity: 0.92;
  }
`;

const LogoutButton = styled.button`
  ${buttonBase}
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #222;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`;
