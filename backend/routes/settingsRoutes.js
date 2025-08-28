import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = Router();

router.use(authRequired, allowRoles("system_admin"));
router.get("/", getSettings);
router.put("/", updateSettings);

export default router;


