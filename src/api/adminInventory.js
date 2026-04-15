import { getAdminProductDetail, updateAdminProduct } from "./adminProduct";
import api from "./axios";

export const getAdminLiveInventoryList = async () => {
  const response = await api.get("/admin/products/live-inventory/list");
  return response.data;
};

const buildAdminProductUpdatePayload = (detail, patch = {}) => {
  return {
    category_id: detail.category_id,
    product_name: detail.product_name ?? "",
    sale_status: patch.sale_status ?? detail.sale_status,
    catalog_external_id: detail.catalog_external_id ?? null,
    catalog_name: detail.catalog_name ?? null,
    sale_price: Number(detail.sale_price ?? 0),
    cost_price: Number(detail.cost_price ?? 0),
    ai_pricing_enabled: Boolean(detail.ai_pricing_enabled),
    min_price_limit: detail.ai_pricing_enabled
      ? detail.min_price_limit ?? null
      : null,
    max_price_limit: detail.ai_pricing_enabled
      ? detail.max_price_limit ?? null
      : null,
    stock_qty: Number(detail.stock_qty ?? 0),
    safety_stock_qty: Number(detail.safety_stock_qty ?? 0),
    expiration_date: detail.expiration_date ?? null,
    description_html: detail.description_html ?? null,
    brand_name: detail.brand_name ?? null,
    origin_country: detail.origin_country ?? null,
    shipping_fee: Number(detail.shipping_fee ?? 0),
    thumbnail_image_url: detail.thumbnail_image_url ?? null,
    detail_image_urls: Array.isArray(detail.detail_image_urls)
      ? detail.detail_image_urls
      : [],
  };
};

export const patchAdminLiveInventoryRow = async (productCode, payload) => {
  const response = await api.patch(
    `/admin/products/live-inventory/${productCode}`,
    payload
  );
  return response.data;
};