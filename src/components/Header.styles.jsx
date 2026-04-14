import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const HeaderShell = styled.div`
  position: sticky;
  top: 0;
  z-index: 1200;
  background: #ffffff;
`;
export const HeaderWrap = styled.header`
  width: 100%;
  height: 68px;
  background: #ffffff;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
`;

export const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  min-width: 0;
`;

export const MenuButton = styled.button`
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

export const BrandLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
`;

export const BrandLogoImage = styled.img`
  height: 24px;
  width: auto;
  display: block;
  object-fit: contain;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 10px;

  @media (max-width: 980px) {
    display: none;
  }
`;

export const NavItem = styled(Link)`
  text-decoration: none;
  color: #222;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    color: #000;
  }
`;

export const RightArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  min-width: 0;
`;

export const SearchBox = styled.div`
  width: 100%;
  max-width: 500px;
  height: 42px;
  border-radius: 999px;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  padding: 0 18px;
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  margin-right: 9px;
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
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

export const ActionGroup = styled.div`
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

export const buttonBase = css`
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

export const GhostActionLink = styled(Link)`
  ${buttonBase}
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #222;

  &:hover {
    background: #f8f8f8;
  }
`;

export const PrimaryActionLink = styled(Link)`
  ${buttonBase}
  border: 1px solid #111;
  background: #111;
  color: #fff;

  &:hover {
    opacity: 0.92;
  }
`;

export const LogoutButton = styled.button`
  ${buttonBase}
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #222;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`;

export const CategoryHoverArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 68px;
`;
/** 카테고리 부분 **/
export const CategoryPanel = styled.div`
  position: absolute;
  top: 100%;
  left: -32px;
  z-index: 1201;
  pointer-events: auto;
`;

export const CategoryInner = styled.div`
  position: relative;
  width: auto;
  max-width: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

export const CategoryBox = styled.div`
  position: relative;
  width: auto;
  max-width: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

export const MainCategoryList = styled.ul`
  width: 206px;
  min-height: 533px;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #ffffff;
  box-sizing: border-box;
`;

export const MainCategoryItem = styled.li`
  margin: 0;
`;

export const MainCategoryButton = styled.button`
  width: 100%;
  height: 56px;
  padding: 0 0 0 26px;
  border: none;
  background: #ffffff;
  color: #111111;
  font-size: 15px;
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "600")};
  text-align: left;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background: #f5f5f5;
  }
`;

export const SubCategoryList = styled.ul`
  position: absolute;
  top: 0;
  left: 100%;
  width: 206px;
  min-height: 533px;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #ffffff;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  box-sizing: border-box;
`;

export const SubCategoryItem = styled.li`
  margin: 0;
`;

// const SubCategoryLink = styled(Link)`
//   display: flex;
//   align-items: center;
//   width: 100%;
//   height: 46px;
//   padding: 0 22px;
//   text-decoration: none;
//   color: #111111;
//   font-size: 15px;
//   font-weight: 600;
//   background: #ffffff;
//   box-sizing: border-box;

//   &:hover {
//     background: #f5f5f5;
//   }
//   `;

export const SubCategoryButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 46px;
  padding: 0 22px;
  border: none;
  text-align: left;
  color: #111111;
  font-size: 15px;
  font-weight: 600;
  background: #ffffff;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;
