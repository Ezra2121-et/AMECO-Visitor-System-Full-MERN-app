import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { listLogs } from "../controllers/logsController.js";

const router = Router();

router.use(authRequired, allowRoles("system_admin", "admin"));
router.get("/", listLogs);

export default router;
