import api from "./axios";

export const getProductList = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};