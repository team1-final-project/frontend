import Api from "./axios";

export const getAdminDashboard = async (params = {}) => {
  const response = await Api.get("/admin/price/dashboard", { params });
  return response.data;
};
