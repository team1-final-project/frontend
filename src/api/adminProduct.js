import api from "./axios";

export const uploadAdminThumbnailImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/products/images/thumbnail", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadAdminDetailImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/products/images/detail", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const createAdminProduct = async (payload) => {
  const response = await api.post("/admin/products", payload);
  return response.data;
};

export const getAdminProductDetail = async (productCode) => {
  const response = await api.get(`/admin/products/${productCode}`);
  return response.data;
};

export const updateAdminProduct = async (productCode, payload) => {
  const response = await api.put(`/admin/products/${productCode}`, payload);
  return response.data;
};

export const resolveCatalogName = async (externalCatalogId) => {
  const response = await api.get(`/admin/products/catalogs/${externalCatalogId}/name`,{
    timeout: 30000,
  });
  return response.data;
}