import { Router } from "express";
import {
	deleteUser,
	getUser,
	getUsers,
	signOut,
	updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/sign-out", signOut);
router.get("/get-users", verifyToken, getUsers);
router.get("/:userId", getUser);

export default router;
