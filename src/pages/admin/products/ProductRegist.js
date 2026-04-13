import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  Search,
  Plus,
  Calendar,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../api/category";

const saleStatusOptions = ["판매중", "판매대기", "일시품절", "품절"];

const editorTools = [
  { icon: <Bold size={14} />, label: "bold" },
  { icon: <Italic size={14} />, label: "italic" },
  { icon: <Underline size={14} />, label: "underline" },
  { icon: <List size={14} />, label: "list" },
  { icon: <ListOrdered size={14} />, label: "ordered-list" },
  { icon: <ImageIcon size={14} />, label: "image" },
  { icon: <LinkIcon size={14} />, label: "link" },
];

export default function ProductRegist() {
  const nav = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoryTab, setCategoryTab] = useState("select");
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [categoryKeyword, setCategoryKeyword] = useState("");

  const [form, setForm] = useState({
    productCode: "자동생성",
    productName: "",
    saleStatus: "판매중",
    categoryKeyword: "",
    supplierName: "",
    sellPrice: "",
    costPrice: "",
    useAiMinPrice: false,
    minPrice: "",
    maxPrice: "",
    useAiMaxPrice: false,
    aiMinPrice: "",
    aiMaxPrice: "",
    stockQty: "",
    safetyStock: "",
    expiryDate: "",
    description: "",
    brandName: "",
    origin: "",
    shippingFrom: "충청남도 천안시 동남구 대흥로 215 7층 (우 : 31144)",
    shippingFee: "",
    returnAddress: "충청남도 천안시 동남구 대흥로 215 7층 (우 : 31144)",
    returnFee: "",
    exchangeFee: "",
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);

        if (data.length > 0) {
          setSelectedMainCategoryId(data[0].id);

          const firstSubCategory = data[0].subCategories?.[0];
          if (firstSubCategory) {
            setSelectedSubCategoryId(firstSubCategory.id);
          }
        }
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  const activeMainCategory = useMemo(() => {
    return categories.find(
      (category) => category.id === selectedMainCategoryId,
    );
  }, [categories, selectedMainCategoryId]);

  const activeSubCategory = useMemo(() => {
    if (!activeMainCategory) return null;

    return activeMainCategory.subCategories?.find(
      (subCategory) => subCategory.id === selectedSubCategoryId,
    );
  }, [activeMainCategory, selectedSubCategoryId]);

  const selectedCategoryLabel =
    activeMainCategory && activeSubCategory
      ? `${activeMainCategory.name} > ${activeSubCategory.name}`
      : "";

  const filteredCategories = useMemo(() => {
    const keyword = categoryKeyword.trim().toLowerCase();

    if (!keyword) return categories;

    return categories
      .map((category) => {
        const mainMatched = category.name.toLowerCase().includes(keyword);

        const matchedSubCategories =
          category.subCategories?.filter((subCategory) =>
            `${category.name} ${subCategory.name}`
              .toLowerCase()
              .includes(keyword),
          ) || [];

        if (mainMatched) return category;
        if (matchedSubCategories.length > 0) {
          return {
            ...category,
            subCategories: matchedSubCategories,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [categories, categoryKeyword]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      mainCategoryId: selectedMainCategoryId,
      subCategoryId: selectedSubCategoryId,
      mainCategoryName: activeMainCategory?.name ?? "",
      subCategoryName: activeSubCategory?.name ?? "",
      previewImage,
    };

    console.log("상품등록 payload:", payload);
  };

  return (
    <PageWrap>
      <PageTitle>상품 등록</PageTitle>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>카테고리</SectionTitle>

          <CategoryTabs>
            <CategoryTabButton
              type="button"
              $active={categoryTab === "select"}
              onClick={() => setCategoryTab("select")}
            >
              카테고리 선택
            </CategoryTabButton>
            <CategoryTabButton
              type="button"
              $active={categoryTab === "search"}
              onClick={() => setCategoryTab("search")}
            >
              카테고리 검색
            </CategoryTabButton>
          </CategoryTabs>

          {categoryTab === "select" ? (
            <CategoryPanel>
              <CategoryColumn>
                {categories.map((category) => (
                  <CategoryItemButton
                    key={category.id}
                    type="button"
                    $active={selectedMainCategoryId === category.id}
                    onClick={() => {
                      setSelectedMainCategoryId(category.id);
                      setSelectedSubCategoryId(
                        category.subCategories?.[0]?.id ?? null,
                      );
                    }}
                  >
                    <span>{category.name}</span>
                    <span>{">"}</span>
                  </CategoryItemButton>
                ))}
              </CategoryColumn>

              <CategoryColumn>
                {activeMainCategory?.subCategories?.map((subCategory) => (
                  <CategoryItemButton
                    key={subCategory.id}
                    type="button"
                    $active={selectedSubCategoryId === subCategory.id}
                    onClick={() => setSelectedSubCategoryId(subCategory.id)}
                  >
                    <span>{subCategory.name}</span>
                  </CategoryItemButton>
                ))}
              </CategoryColumn>
            </CategoryPanel>
          ) : (
            <SearchCategoryPanel>
              <CategorySearchWrap>
                <SearchIconWrap>
                  <Search size={14} />
                </SearchIconWrap>
                <CategorySearchInput
                  value={categoryKeyword}
                  onChange={(e) => setCategoryKeyword(e.target.value)}
                  placeholder="카테고리 검색..."
                />
              </CategorySearchWrap>

              <SearchResultList>
                {filteredCategories.map((category) =>
                  category.subCategories?.map((subCategory) => {
                    const fullName = `${category.name} > ${subCategory.name}`;
                    const isActive =
                      selectedMainCategoryId === category.id &&
                      selectedSubCategoryId === subCategory.id;

                    return (
                      <SearchResultButton
                        key={subCategory.id}
                        type="button"
                        $active={isActive}
                        onClick={() => {
                          setSelectedMainCategoryId(category.id);
                          setSelectedSubCategoryId(subCategory.id);
                        }}
                      >
                        {fullName}
                      </SearchResultButton>
                    );
                  }),
                )}
              </SearchResultList>
            </SearchCategoryPanel>
          )}

          <SelectedCategoryRow>
            <MiniLabel>카테고리 선택</MiniLabel>
            <SelectedCategoryValue>
              {selectedCategoryLabel || "카테고리를 선택하세요"}
            </SelectedCategoryValue>
          </SelectedCategoryRow>
        </Section>

        <Section>
          <SectionTitle>상품정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>상품코드</FormLabel>
              <FormField>
                <Input
                  value={form.productCode}
                  onChange={(e) => handleChange("productCode", e.target.value)}
                  placeholder="자동생성"
                  readOnly
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>상품명</FormLabel>
              <FormField>
                <Input
                  value={form.productName}
                  onChange={(e) => handleChange("productName", e.target.value)}
                  placeholder="상품명을 입력하세요"
                  maxLength={100}
                />
                <HelperText>{form.productName.length}/100</HelperText>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>판매상태</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>판매상태</FormLabel>
              <FormField>
                <Select
                  value={form.saleStatus}
                  onChange={(e) => handleChange("saleStatus", e.target.value)}
                >
                  {saleStatusOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>가격비교 정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>카테고리 ID</FormLabel>
              <FormField>
                <SearchInputWrap>
                  <Input
                    value={form.categoryKeyword}
                    onChange={(e) =>
                      handleChange("categoryKeyword", e.target.value)
                    }
                    placeholder="카테고리 ID 입력"
                  />
                  <InlineSearchButton type="button">
                    <Search size={14} />
                  </InlineSearchButton>
                </SearchInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>카테고리명</FormLabel>
              <FormField>
                <ReadOnlyBox>{selectedCategoryLabel}</ReadOnlyBox>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>가격정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>판매가</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.sellPrice}
                    onChange={(e) => handleChange("sellPrice", e.target.value)}
                    placeholder="판매가"
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>원가</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.costPrice}
                    onChange={(e) => handleChange("costPrice", e.target.value)}
                    placeholder="원가"
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>Ai 가격 변경</FormLabel>
              <FormField>
                <ToggleRow>
                  <ToggleButton
                    type="button"
                    $checked={form.useAiMaxPrice}
                    onClick={() =>
                      handleChange("useAiMaxPrice", !form.useAiMaxPrice)
                    }
                  >
                    <ToggleThumb $checked={form.useAiMaxPrice} />
                  </ToggleButton>
                </ToggleRow>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>최소가 제한</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.aiMinPrice}
                    onChange={(e) => handleChange("aiMinPrice", e.target.value)}
                    placeholder="최소가 제한"
                    disabled={!form.useAiMaxPrice}
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>최대가 제한</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.aiMaxPrice}
                    onChange={(e) => handleChange("aiMaxPrice", e.target.value)}
                    placeholder="최대가 제한"
                    disabled={!form.useAiMaxPrice}
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>재고정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>재고수량</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.stockQty}
                    onChange={(e) => handleChange("stockQty", e.target.value)}
                    placeholder="재고수량"
                  />
                  <UnitText>개</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>안전재고</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.safetyStock}
                    onChange={(e) =>
                      handleChange("safetyStock", e.target.value)
                    }
                    placeholder="안전재고"
                  />
                  <UnitText>개</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>유통기한</FormLabel>
              <FormField>
                <DateInputWrap>
                  <Input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                  />
                  <DateIconWrap>
                    <Calendar size={14} />
                  </DateIconWrap>
                </DateInputWrap>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>대표이미지</SectionTitle>

          <ImageUploadArea>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <ImagePreviewButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewImage ? (
                <PreviewImage src={previewImage} alt="preview" />
              ) : (
                <UploadPlaceholder>
                  <Plus size={28} />
                </UploadPlaceholder>
              )}
            </ImagePreviewButton>

            <ImageGuide>
              권장크기 : 1000×1000
              <br />
              jpg, jpeg, png, bmp 형식의 정사 이미지 파일을 등록하세요.
            </ImageGuide>
          </ImageUploadArea>
        </Section>

        <Section>
          <SectionTitle>상세설명</SectionTitle>

          <EditorWrap>
            <EditorToolbar>
              <EditorSelect defaultValue="Normal">
                <option>Normal</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
              </EditorSelect>

              <EditorSelect defaultValue="Normal">
                <option>Normal</option>
                <option>Small</option>
                <option>Large</option>
              </EditorSelect>

              <ToolbarDivider />

              {editorTools.map((tool) => (
                <EditorToolButton key={tool.label} type="button">
                  {tool.icon}
                </EditorToolButton>
              ))}
            </EditorToolbar>

            <EditorTextArea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="상세설명을 입력하세요"
            />
          </EditorWrap>

          <EditorNotice>
            상세설명 작성 유의 : 기본 800byte
            <br />
            일부 상품은 판매 제한카테고리에만 진열, 이외엔 즉시 노출되지
            않습니다.
            <br />
            상품명과 재고 관련 심사, 상세설명 기입 등에 따라 실사 시 관리자에
            의해 제한될 수 있습니다.
          </EditorNotice>
        </Section>

        <Section>
          <SectionTitle>기타정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>브랜드명</FormLabel>
              <FormField>
                <SearchInputWrap>
                  <Input
                    value={form.brandName}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    placeholder="브랜드명"
                  />
                  <InlineSearchButton type="button">
                    <Search size={14} />
                  </InlineSearchButton>
                </SearchInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>원산지</FormLabel>
              <FormField>
                <Input
                  value={form.origin}
                  onChange={(e) => handleChange("origin", e.target.value)}
                  placeholder="원산지"
                />
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>배송정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>출하지</FormLabel>
              <FormField>
                <Input
                  value={form.shippingFrom}
                  onChange={(e) => handleChange("shippingFrom", e.target.value)}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>배송비</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.shippingFee}
                    onChange={(e) =>
                      handleChange("shippingFee", e.target.value)
                    }
                    placeholder="배송비"
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>반품/교환/AS 정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>반품/교환지</FormLabel>
              <FormField>
                <Input
                  value={form.returnAddress}
                  onChange={(e) =>
                    handleChange("returnAddress", e.target.value)
                  }
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>반품배송비(편도)</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.returnFee}
                    onChange={(e) => handleChange("returnFee", e.target.value)}
                    placeholder="반품배송비"
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>교환배송비(왕복)</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.exchangeFee}
                    onChange={(e) =>
                      handleChange("exchangeFee", e.target.value)
                    }
                    placeholder="교환배송비"
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <BottomButtonRow>
          <CancelButton type="button" onClick={() => nav(-1)}>
            취소
          </CancelButton>
          <SubmitButton type="submit">상품등록</SubmitButton>
        </BottomButtonRow>
      </Form>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 24px;
  background: #f6f8fb;
  min-height: 100%;
`;

const PageTitle = styled.h2`
  margin: 0 0 18px;
  color: #111827;
  font-size: 28px;
  font-weight: 800;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Section = styled.section`
  padding: 18px 20px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  background: #ffffff;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px;
  color: #111827;
  font-size: 20px;
  font-weight: 800;
`;

const CategoryTabs = styled.div`
  display: inline-flex;
  margin-bottom: 12px;
  border-radius: 10px;
  background: #f3f6fb;
  padding: 4px;
`;

const CategoryTabButton = styled.button`
  min-width: 120px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#6b7280")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const CategoryPanel = styled.div`
  display: grid;
  grid-template-columns: 220px 220px;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryColumn = styled.div`
  min-height: 180px;
  border: 1px solid #e8edf4;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
`;

const CategoryItemButton = styled.button`
  width: 100%;
  min-height: 42px;
  padding: 0 14px;
  border: none;
  border-bottom: 1px solid #f1f4f8;
  background: ${({ $active }) => ($active ? "#f4f8ff" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#2563eb" : "#374151")};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const SearchCategoryPanel = styled.div`
  margin-bottom: 12px;
`;

const CategorySearchWrap = styled.div`
  position: relative;
  max-width: 360px;
  margin-bottom: 12px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategorySearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px 0 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const SearchResultList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SearchResultButton = styled.button`
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ $active }) => ($active ? "#2563eb" : "#e5e7eb")};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#eff6ff" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#2563eb" : "#4b5563")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const SelectedCategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MiniLabel = styled.div`
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
`;

const SelectedCategoryValue = styled.div`
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafbfc;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 14px;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const FormLabel = styled.label`
  color: #374151;
  font-size: 13px;
  font-weight: 700;
`;

const FormField = styled.div`
  min-width: 0;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: ${({ readOnly, disabled }) =>
    disabled || readOnly ? "#f3f4f6" : "#ffffff"};
  color: #111827;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #cfd8e3;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 180px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const HelperText = styled.div`
  margin-top: 6px;
  color: #9ca3af;
  font-size: 12px;
  text-align: right;
`;

const SearchInputWrap = styled.div`
  position: relative;
  max-width: 340px;
`;

const InlineSearchButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ReadOnlyBox = styled.div`
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafbfc;
  color: #374151;
  font-size: 13px;
  display: flex;
  align-items: center;
`;

const UnitInputWrap = styled.div`
  position: relative;
  max-width: 220px;
`;

const UnitText = styled.span`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 12px;
  font-weight: 600;
`;

const DateInputWrap = styled.div`
  position: relative;
  max-width: 220px;
`;

const DateIconWrap = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  position: relative;
  width: 34px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? "#2563eb" : "#d1d5db")};
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  transition: background 0.15s ease;
`;

const ToggleThumb = styled.span`
  position: absolute;
  top: 50%;
  left: ${({ $checked }) => ($checked ? "16px" : "2px")};
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  transition: left 0.15s ease;
`;

const ImageUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewButton = styled.button`
  width: 160px;
  height: 160px;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
  background: #fafbfc;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
`;

const UploadPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageGuide = styled.div`
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.6;
`;

const EditorWrap = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
`;

const EditorToolbar = styled.div`
  min-height: 44px;
  padding: 0 10px;
  border-bottom: 1px solid #eef2f7;
  background: #fafbfc;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const EditorSelect = styled.select`
  height: 30px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 12px;
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 18px;
  background: #e5e7eb;
  margin: 0 4px;
`;

const EditorToolButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #eef2f7;
  }
`;

const EditorTextArea = styled.textarea`
  width: 100%;
  min-height: 260px;
  border: none;
  outline: none;
  resize: vertical;
  padding: 16px;
  box-sizing: border-box;
  color: #111827;
  font-size: 14px;
  line-height: 1.6;
`;

const EditorNotice = styled.div`
  margin-top: 10px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.7;
`;

const BottomButtonRow = styled.div`
  padding: 8px 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const CancelButton = styled.button`
  min-width: 96px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #4b5563;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  min-width: 96px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;
