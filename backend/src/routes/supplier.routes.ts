import { Router } from "express";
import { SupplierController } from "../controllers/supplier.controller";
import { rbacMiddleware, manageRoles, writeRoles } from "../middlewares/rbac.middleware";

const router = Router();
const controller = new SupplierController();

router.get("/", controller.list.bind(controller));
router.get("/:id", controller.detail.bind(controller));
router.post("/", rbacMiddleware(manageRoles), controller.create.bind(controller));
router.put("/:id", rbacMiddleware(manageRoles), controller.update.bind(controller));
router.delete("/:id", rbacMiddleware(manageRoles), controller.remove.bind(controller));
router.put("/:id/products", rbacMiddleware(writeRoles), controller.bindProducts.bind(controller));

export default router;
