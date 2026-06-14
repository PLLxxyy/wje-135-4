export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  contactPhone?: string;
  email?: string;
  address?: string;
  remark?: string;
  productSuppliers?: { product: { id: string; name: string; sku: string } }[];
  _count?: { orders: number };
  createdAt: string;
  updatedAt: string;
}
