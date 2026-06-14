import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.config";
import { BusinessError } from "../utils/response";

export class SupplierService {
  async list() {
    return prisma.supplier.findMany({
      include: {
        productSuppliers: { include: { product: true } },
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async detail(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        productSuppliers: { include: { product: true } },
        orders: { include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } }
      }
    });
    if (!supplier) {
      throw new BusinessError("供应商不存在", 404);
    }
    return supplier;
  }

  async create(data: Prisma.SupplierCreateInput) {
    return prisma.supplier.create({ data });
  }

  async update(id: string, data: Prisma.SupplierUpdateInput) {
    await this.ensureSupplier(id);
    return prisma.supplier.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.ensureSupplier(id);
    return prisma.supplier.delete({ where: { id } });
  }

  async bindProducts(supplierId: string, productIds: string[]) {
    await this.ensureSupplier(supplierId);
    await prisma.productSupplier.deleteMany({ where: { supplierId } });
    if (productIds.length) {
      await prisma.productSupplier.createMany({
        data: productIds.map((productId) => ({ productId, supplierId }))
      });
    }
    return this.detail(supplierId);
  }

  private async ensureSupplier(id: string) {
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new BusinessError("供应商不存在", 404);
    }
    return supplier;
  }
}
