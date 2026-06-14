import { API_PATHS } from "../constants/apiPaths";
import type { Supplier } from "../types";
import { request, unwrap } from "../utils/request";

export const supplierApi = {
  list: () => unwrap<Supplier[]>(request.get(API_PATHS.suppliers)),
  detail: (id: string) => unwrap<Supplier>(request.get(`${API_PATHS.suppliers}/${id}`)),
  create: (payload: Partial<Supplier>) => unwrap<Supplier>(request.post(API_PATHS.suppliers, payload)),
  update: (id: string, payload: Partial<Supplier>) => unwrap<Supplier>(request.put(`${API_PATHS.suppliers}/${id}`, payload)),
  remove: (id: string) => unwrap<Supplier>(request.delete(`${API_PATHS.suppliers}/${id}`)),
  bindProducts: (id: string, productIds: string[]) => unwrap<Supplier>(request.put(`${API_PATHS.suppliers}/${id}/products`, { productIds }))
};
