import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import logo from "../assets/stocker-logo.svg";
import { useAuth } from "../context/AuthContext";

const CATEGORY_DATA = [
  {
    id: 1,
    name: "가공 / 간편식품",
    subCategories: ["라면", "즉석식품", "카레"],
  },
  {
    id: 2,
    name: "간식 / 음료",
    subCategories: ["스낵과자", "탄산음료"],
  },
  {
    id: 3,
    name: "냉장 / 육가공",
    subCategories: ["소시지"],
  },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitializing, logout } = useAuth();



  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const headerShellRef = useRef(null);

  const activeCategory = CATEGORY_DATA.find(
    (category) => category.id === activeCategoryId
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsCategoryOpen(false);
      setActiveCategoryId(null);
      navigate("/");
    }
  };


  const handleToggleCategory = () => {
    setIsCategoryOpen((prev) => {
      const nextValue = !prev;

      if (!prev) {
        setActiveCategoryId(null);
      }

      return nextValue;
    });
  };

  const handleCloseCategory = () => {
    setIsCategoryOpen(false);
    setActiveCategoryId(null);
  };
  const handleClickMainCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerShellRef.current &&
        !headerShellRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
        setActiveCategoryId(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
        setActiveCategoryId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsCategoryOpen(false);
    setActiveCategoryId(null);
  }, [location.pathname]);

  return (
    <HeaderShell ref={headerShellRef}>
      <HeaderWrap>
        <Inner>
          <LeftArea>
            <MenuButton type="button" onClick={handleToggleCategory}>
              <Menu size={25} />
            </MenuButton>

            <BrandLogoLink to="/" onClick={handleCloseCategory}>
              <BrandLogoImage src={logo} alt="STOCK+er" />
            </BrandLogoLink>

            <Nav>
              <NavItem to="/" onClick={handleCloseCategory}>
                Best
              </NavItem>
              <NavItem to="/" onClick={handleCloseCategory}>
                Sales
              </NavItem>
              <NavItem to="/" onClick={handleCloseCategory}>
                Hot Deal
              </NavItem>
              <NavItem to="/" onClick={handleCloseCategory}>
                New Arrivals
              </NavItem>
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

      {isCategoryOpen && (
        <CategoryPanel>
          <CategoryInner>
            <CategoryBox>
              <MainCategoryList>
                {CATEGORY_DATA.map((category) => (
                  <MainCategoryItem key={category.id}>
                    <MainCategoryButton
                      type="button"
                      $isActive={activeCategoryId === category.id}
                      onClick={() => handleClickMainCategory(category.id)}
                    >
                      {category.name}
                    </MainCategoryButton>
                  </MainCategoryItem>
                ))}
              </MainCategoryList>

              {activeCategory && (
                <SubCategoryList>
                  {activeCategory.subCategories.map((subCategory) => (
                    <SubCategoryItem key={subCategory}>
                      <SubCategoryLink to="/" onClick={handleCloseCategory}>
                        {subCategory}
                      </SubCategoryLink>
                    </SubCategoryItem>
                  ))}
                </SubCategoryList>
              )}
            </CategoryBox>
          </CategoryInner>
        </CategoryPanel>
      )}
    </HeaderShell>
  );
}
const HeaderShell = styled.div`
    position: sticky;
    top: 0;
    z-index: 1200;
    background: #ffffff;
  `;
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
/** 카테고리 부분 **/
const CategoryPanel = styled.div`
  position: absolute;
  top: 68px;
  left: 0;
  width: 100%;
  z-index: 1201;
  pointer-events: none;
  `;

const CategoryInner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0;               
  box-sizing: border-box;
  position: relative;
  `;

const CategoryBox = styled.div`
  position: relative;
  width: 206px;             
  min-height: 536px;        
  background: #ffffff;
  border-right: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  pointer-events: auto;
  `;

const MainCategoryList = styled.ul`
  position: relative;
  width: 206px;             
  min-height: 536px;       
  background: #ffffff;
  border-right: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  pointer-events: auto;
  `;

const MainCategoryItem = styled.li`
    margin: 0;
  `;

const MainCategoryButton = styled.button`
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

const SubCategoryList = styled.ul`
  position: absolute;
  top: 0;
  left: 100%;              
  width: 206px;
  min-height: 536px;
  margin: 0;
  list-style: none;
  background: #ffffff;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  `;

const SubCategoryItem = styled.li`
    margin: 0;
  `;

const SubCategoryLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 46px;
  padding: 0 22px;
  text-decoration: none;
  color: #111111;
  font-size: 15px;
  font-weight: 600;
  background: #ffffff;
  box-sizing: border-box;

  &:hover {
    background: #f5f5f5;
  }
  `;

