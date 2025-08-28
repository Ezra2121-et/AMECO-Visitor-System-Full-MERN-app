// backend/routes/sourceRoutes.js
import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { listSources, createSource, updateSource, deleteSource } from "../controllers/sourcesController.js";

const router = Router();

router.use(authRequired);

// Everyone logged-in can list sources (receptionist needs this for the form)
router.get("/", listSources);

// Only admin & system_admin can modify sources
router.post("/", allowRoles("system_admin", "admin"), createSource);
router.put("/:id", allowRoles("system_admin", "admin"), updateSource);
router.delete("/:id", allowRoles("system_admin", "admin"), deleteSource);

export default router;
