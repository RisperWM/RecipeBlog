import { Router } from "express";
import { register } from "../controller/userController.js";
import { login } from "../controller/userController.js";

const router = Router()

router.post("/login", login)
router.post("/register", register)

export default router