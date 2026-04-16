import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Search, Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";
import "react-quill/dist/quill.snow.css";

import { getCategories } from "../../../api/category";
import {
  createAdminProduct,
  resolveCatalogName,
  uploadAdminDetailImage,
  uploadAdminThumbnailImage,
} from "../../../api/adminProduct";
import ToggleSwitch from "../../../components/ToggleSwitch";


Quill.register("modules/blotFormatter", BlotFormatter);
const saleStatusOptions = [
  { value: "ON_SALE", label: "판매중" },
  { value: "READY", label: "판매예정" },
  { value: "STOPPED", label: "판매중지" },
  { value: "SOLD_OUT", label: "품절" },
  { value: "ENDED", label: "판매종료" },
];

const FIXED_SHIPPING_FROM = "충청남도 천안시 동남구 대흥로 215 7층 (우 : 31144)";
const FIXED_RETURN_ADDRESS = "충청남도 천안시 동남구 대흥로 215 7층 (우 : 31144)";

export default function ProductRegist() {
  const nav = useNavigate();
  const thumbnailInputRef = useRef(null);
  const quillRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoryTab, setCategoryTab] = useState("select");
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [categoryKeyword, setCategoryKeyword] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [detailImageUrls, setDetailImageUrls] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isDetailImageUploading, setIsDetailImageUploading] = useState(false);

  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");

  const [form, setForm] = useState({
    productCode: "자동 생성",
    productName: "",
    saleStatus: "ON_SALE",

    catalogExternalId: "",
    catalogName: "",

    salePrice: "",
    costPrice: "",

    useAiPrice: false,
    minPrice: "",
    maxPrice: "",

    stockQty: "",
    safetyStock: "",
    expiryDate: "",

    description: "",

    brandName: "",
    origin: "",

    shippingFrom: FIXED_SHIPPING_FROM,
    shippingFee: "",

    returnAddress: FIXED_RETURN_ADDRESS,
    returnFee: "",
    exchangeFee: "",
  });

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
        console.error(error);
        alert("카테고리 조회에 실패했습니다.");
      }
    };

    fetchCategories();
  }, []);

  const activeMainCategory = useMemo(() => {
    return categories.find((category) => category.id === selectedMainCategoryId);
  }, [categories, selectedMainCategoryId]);

  const activeSubCategory = useMemo(() => {
    if (!activeMainCategory) return null;
    return activeMainCategory.subCategories?.find(
      (subCategory) => subCategory.id === selectedSubCategoryId
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
              .includes(keyword)
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

  const handleResolveCatalogName = async () => {
    const catalogId = form.catalogExternalId.trim();

    if (!catalogId) {
      setCatalogError("");
      handleChange("catalogName", "");
      return;
    }

    try {
      setIsCatalogLoading(true);
      setCatalogError("");

      const data = await resolveCatalogName(catalogId);

      handleChange("catalogName", data.catalog_name ?? "");
    } catch (error) {
      console.error(error);
      setCatalogError(
        error?.response?.data?.detail || "카탈로그 이름 조회에 실패했습니다."
      );
      handleChange("catalogName", "");
    } finally {
      setIsCatalogLoading(false);
    }
  };

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsThumbnailUploading(true);
      const localPreview = URL.createObjectURL(file);
      setThumbnailPreview(localPreview);

      const result = await uploadAdminThumbnailImage(file);
      setThumbnailUrl(result.image_url);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "대표이미지 업로드에 실패했습니다.");
      setThumbnailPreview(null);
      setThumbnailUrl("");
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const handleEditorImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setIsDetailImageUploading(true);

        const result = await uploadAdminDetailImage(file);
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);

        if (editor) {
          editor.insertEmbed(
            range ? range.index : editor.getLength(),
            "image",
            result.image_url
          );
          editor.setSelection((range ? range.index : editor.getLength()) + 1);
        }

        setDetailImageUrls((prev) => {
          if (prev.includes(result.image_url)) return prev;
          return [...prev, result.image_url];
        });
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.detail || "상세 이미지 업로드에 실패했습니다.");
      } finally {
        setIsDetailImageUploading(false);
      }
    };
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleEditorImageUpload,
        },
      },
      blotFormatter: {},
    }),
    []
  );

  const quillFormats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSubCategoryId) {
      alert("소분류 카테고리를 선택해주세요.");
      return;
    }

    if (!form.productName.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!form.salePrice) {
      alert("판매가를 입력해주세요.");
      return;
    }

    if (!form.stockQty) {
      alert("재고수량을 입력해주세요.");
      return;
    }

    if (!thumbnailUrl) {
      alert("대표이미지를 업로드해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        category_id: selectedSubCategoryId,
        product_name: form.productName.trim(),
        sale_status: form.saleStatus,

        catalog_external_id: form.catalogExternalId.trim() || null,
        catalog_name: form.catalogName.trim() || null,

        sale_price: Number(form.salePrice || 0),
        cost_price: Number(form.costPrice || 0),

        ai_pricing_enabled: form.useAiPrice,
        min_price_limit: form.useAiPrice && form.minPrice ? Number(form.minPrice) : null,
        max_price_limit: form.useAiPrice && form.maxPrice ? Number(form.maxPrice) : null,

        stock_qty: Number(form.stockQty || 0),
        safety_stock_qty: Number(form.safetyStock || 0),
        expiration_date: form.expiryDate || null,

        description_html: form.description || "",

        brand_name: form.brandName.trim() || null,
        origin_country: form.origin.trim() || null,

        shipping_fee: Number(form.shippingFee || 0),

        thumbnail_image_url: thumbnailUrl,
        detail_image_urls: detailImageUrls,
      };

      const result = await createAdminProduct(payload);

      alert("상품이 등록되었습니다.");
        nav("/admin/product-list", {
          replace: true,
          state: { createdProductCode: result.product_code },
        });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "상품 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
                      setSelectedSubCategoryId(category.subCategories?.[0]?.id ?? null);
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
                  })
                )}
              </SearchResultList>
            </SearchCategoryPanel>
          )}

          <SelectedCategoryRow>
            <MiniLabel>선택된 카테고리</MiniLabel>
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
                <Input value={form.productCode} readOnly />
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
                    <option key={item.value} value={item.value}>
                      {item.label}
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
              <FormLabel>카탈로그 ID</FormLabel>
              <FormField>
                <Input
                  value={form.catalogExternalId}
                  onChange={(e) => handleChange("catalogExternalId", e.target.value)}
                  onBlur={handleResolveCatalogName}
                  placeholder="예: 53390091166"
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>카탈로그명</FormLabel>
              <FormField>
                <Input
                  value={form.catalogName}
                  readOnly
                  placeholder={isCatalogLoading ? "카탈로그 조회 중..." : "자동으로 입력됩니다."}
                />
                {catalogError ? (
                  <HelperText style={{ color: "#dc2626", textAlign: "left" }}>
                    {catalogError}
                  </HelperText>
                ) : null}
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
                    value={form.salePrice}
                    onChange={(e) => handleChange("salePrice", e.target.value)}
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
              <FormLabel>AI 가격 변경</FormLabel>
              <FormField>
                <ToggleSwitch
                  checked={form.useAiPrice}
                  onChange={(nextChecked) => handleChange("useAiPrice", nextChecked)}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>최소가 제한</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.minPrice}
                    onChange={(e) => handleChange("minPrice", e.target.value)}
                    placeholder="최소가 제한"
                    disabled={!form.useAiPrice}
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
                    value={form.maxPrice}
                    onChange={(e) => handleChange("maxPrice", e.target.value)}
                    placeholder="최대가 제한"
                    disabled={!form.useAiPrice}
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
                    onChange={(e) => handleChange("safetyStock", e.target.value)}
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
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
            />

            <ImagePreviewButton
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              {thumbnailPreview ? (
                <PreviewImage src={thumbnailPreview} alt="thumbnail preview" />
              ) : (
                <UploadPlaceholder>
                  <Plus size={28} />
                </UploadPlaceholder>
              )}
            </ImagePreviewButton>

            <ImageGuide>
              {isThumbnailUploading
                ? "대표이미지 업로드 중..."
                : "권장크기 : 1000×1000 / jpg, jpeg, png, bmp"}
            </ImageGuide>
          </ImageUploadArea>
        </Section>

        <Section>
          <SectionTitle>상세설명</SectionTitle>

          <EditorWrap>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={form.description}
              onChange={(value) => handleChange("description", value)}
              modules={quillModules}
              formats={quillFormats}
              placeholder="상품 상세설명을 입력하세요."
            />
          </EditorWrap>

          <EditorNotice>
            {isDetailImageUploading
              ? "상세설명 이미지 업로드 중..."
              : "이미지 버튼을 누르면 상세 이미지를 업로드할 수 있습니다."}
          </EditorNotice>
        </Section>

        <Section>
          <SectionTitle>기타정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>브랜드명</FormLabel>
              <FormField>
                <Input
                  value={form.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                  placeholder="브랜드명"
                />
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
                <Input value={form.shippingFrom} readOnly />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>배송비</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.shippingFee}
                    onChange={(e) => handleChange("shippingFee", e.target.value)}
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
                <Input value={form.returnAddress} readOnly />
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
                    onChange={(e) => handleChange("exchangeFee", e.target.value)}
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
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "상품등록"}
          </SubmitButton>
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
`;

const HelperText = styled.div`
  margin-top: 6px;
  color: #9ca3af;
  font-size: 12px;
  text-align: right;
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
  .ql-toolbar.ql-snow {
    border: 1px solid #e5e7eb;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }

  .ql-container.ql-snow {
    border: 1px solid #e5e7eb;
    border-top: none;
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    min-height: 280px;
    background: #ffffff;
  }

  .ql-editor {
    min-height: 280px;
    font-size: 14px;
    line-height: 1.7;
    color: #111827;
  }
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background: #1d4ed8;
  }
`;