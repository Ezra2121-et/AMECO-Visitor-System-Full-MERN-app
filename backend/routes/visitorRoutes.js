import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { listVisitors, createVisitor, updateVisitor, deleteVisitor, visitorStats, updateVisitorFeedback } from "../controllers/visitorsController.js";

const router = Router();

router.use(authRequired);
router.get("/", allowRoles("admin", "receptionist", "system_admin"), listVisitors);
router.get("/stats", allowRoles("admin", "system_admin"), visitorStats);
router.post("/", allowRoles("admin", "receptionist"), createVisitor);
router.put("/:id", allowRoles("admin", "receptionist"), updateVisitor);
router.put("/:id/feedback", allowRoles("receptionist", "admin"), updateVisitorFeedback);
router.delete("/:id", allowRoles("admin"), deleteVisitor);

export default router;
