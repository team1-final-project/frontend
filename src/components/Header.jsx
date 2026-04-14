import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import logo from "../assets/stocker-logo.svg";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../api/category";
import * as S from "./Header.styles.jsx";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitializing, logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const headerShellRef = useRef(null);

  const activeCategory = categories.find(
    (category) => category.id === activeCategoryId,
  );

  const handleOpenCategory = () => {
    setIsCategoryOpen(true);

    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  };

  const handleCloseCategory = () => {
    setIsCategoryOpen(false);
    setActiveCategoryId(null);
  };

  const handleClickMainCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
  };

  const handleClickSubCategory = (mainCategoryName, subCategoryName) => {
    const searchParams = new URLSearchParams({
      category: mainCategoryName,
      subCategory: subCategoryName,
    });

    handleCloseCategory();
    navigate(`/?${searchParams.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      handleCloseCategory();
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);

        if (data.length > 0) {
          setActiveCategoryId(data[0].id);
        }
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerShellRef.current &&
        !headerShellRef.current.contains(event.target)
      ) {
        handleCloseCategory();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseCategory();
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
    handleCloseCategory();
  }, [location.pathname]);

  return (
    <S.HeaderShell ref={headerShellRef}>
      <S.HeaderWrap>
        <S.Inner>
          <S.LeftArea>
            <S.CategoryHoverArea
              onMouseEnter={handleOpenCategory}
              onMouseLeave={handleCloseCategory}
            >
              <S.MenuButton type="button">
                <Menu size={25} />
              </S.MenuButton>

              {isCategoryOpen && (
                <S.CategoryPanel>
                  <S.CategoryInner>
                    <S.CategoryBox>
                      <S.MainCategoryList>
                        {categories.map((category) => (
                          <S.MainCategoryItem key={category.id}>
                            <S.MainCategoryButton
                              type="button"
                              $isActive={activeCategoryId === category.id}
                              onMouseEnter={() =>
                                handleClickMainCategory(category.id)
                              }
                            >
                              {category.name}
                            </S.MainCategoryButton>
                          </S.MainCategoryItem>
                        ))}
                      </S.MainCategoryList>

                      {activeCategory && (
                        <S.SubCategoryList>
                          {activeCategory.subCategories.map((subCategory) => (
                            <S.SubCategoryItem key={subCategory.id}>
                              <S.SubCategoryButton
                                type="button"
                                onClick={() =>
                                  handleClickSubCategory(
                                    activeCategory.name,
                                    subCategory.name,
                                  )
                                }
                              >
                                {subCategory.name}
                              </S.SubCategoryButton>
                            </S.SubCategoryItem>
                          ))}
                        </S.SubCategoryList>
                      )}
                    </S.CategoryBox>
                  </S.CategoryInner>
                </S.CategoryPanel>
              )}
            </S.CategoryHoverArea>

            <S.BrandLogoLink to="/" onClick={handleCloseCategory}>
              <S.BrandLogoImage src={logo} alt="STOCK+er" />
            </S.BrandLogoLink>

            <S.Nav>
              <S.NavItem to="/" onClick={handleCloseCategory}>
                Best
              </S.NavItem>
              <S.NavItem to="/" onClick={handleCloseCategory}>
                Sales
              </S.NavItem>
              <S.NavItem to="/" onClick={handleCloseCategory}>
                Hot Deal
              </S.NavItem>
              <S.NavItem to="/" onClick={handleCloseCategory}>
                New Arrivals
              </S.NavItem>
            </S.Nav>
          </S.LeftArea>

          <S.RightArea>
            <S.SearchBox>
              <S.SearchIcon>
                <Search size={18} />
              </S.SearchIcon>
              <S.SearchInput placeholder="Search for products..." />
            </S.SearchBox>

            <S.ActionGroup $isAuthenticated={isAuthenticated}>
              {!isInitializing &&
                (isAuthenticated ? (
                  <>
                    <S.GhostActionLink to="/cart">장바구니</S.GhostActionLink>
                    <S.GhostActionLink to="/profile">프로필</S.GhostActionLink>
                    <S.LogoutButton type="button" onClick={handleLogout}>
                      로그아웃
                    </S.LogoutButton>
                  </>
                ) : (
                  <>
                    <S.GhostActionLink to="/login">로그인</S.GhostActionLink>
                    <S.PrimaryActionLink to="/signup">
                      회원가입
                    </S.PrimaryActionLink>
                  </>
                ))}
            </S.ActionGroup>
          </S.RightArea>
        </S.Inner>
      </S.HeaderWrap>
    </S.HeaderShell>
  );
}
