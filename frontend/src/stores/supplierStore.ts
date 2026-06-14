import { defineStore } from "pinia";
import { supplierApi } from "../api/supplier";
import type { Supplier } from "../types";

export const useSupplierStore = defineStore("supplier", {
  state: () => ({
    suppliers: [] as Supplier[],
    current: null as Supplier | null,
    loading: false
  }),
  actions: {
    async fetchSuppliers() {
      this.loading = true;
      try {
        this.suppliers = await supplierApi.list();
      } finally {
        this.loading = false;
      }
    },
    async fetchDetail(id: string) {
      this.current = await supplierApi.detail(id);
    },
    async create(payload: Partial<Supplier>) {
      await supplierApi.create(payload);
      await this.fetchSuppliers();
    },
    async update(id: string, payload: Partial<Supplier>) {
      await supplierApi.update(id, payload);
      await this.fetchSuppliers();
    },
    async remove(id: string) {
      await supplierApi.remove(id);
      if (this.current?.id === id) {
        this.current = null;
      }
      await this.fetchSuppliers();
    },
    async bindProducts(id: string, productIds: string[]) {
      await supplierApi.bindProducts(id, productIds);
      await this.fetchDetail(id);
    }
  }
});
