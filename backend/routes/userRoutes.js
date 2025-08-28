import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { listUsers, createUser, updateUser, deleteUser } from "../controllers/usersController.js";

const router = Router();

router.use(authRequired, allowRoles("admin", "system_admin"));
router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
