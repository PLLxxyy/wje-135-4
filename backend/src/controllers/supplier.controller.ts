import { Request, Response } from "express";
import { SupplierService } from "../services/supplier.service";
import { created, ok } from "../utils/response";

const service = new SupplierService();

export class SupplierController {
  async list(_req: Request, res: Response) {
    ok(res, await service.list());
  }

  async detail(req: Request, res: Response) {
    ok(res, await service.detail(req.params.id));
  }

  async create(req: Request, res: Response) {
    created(
      res,
      await service.create({
        name: req.body.name,
        contactPerson: req.body.contactPerson,
        contactPhone: req.body.contactPhone,
        email: req.body.email,
        address: req.body.address,
        remark: req.body.remark
      })
    );
  }

  async update(req: Request, res: Response) {
    ok(
      res,
      await service.update(req.params.id, {
        name: req.body.name,
        contactPerson: req.body.contactPerson,
        contactPhone: req.body.contactPhone,
        email: req.body.email,
        address: req.body.address,
        remark: req.body.remark
      })
    );
  }

  async remove(req: Request, res: Response) {
    ok(res, await service.remove(req.params.id));
  }

  async bindProducts(req: Request, res: Response) {
    ok(res, await service.bindProducts(req.params.id, req.body.productIds || []));
  }
}
