import express from "express"
import { signUp,Login,  logout, checkAuth} from "../controller/Atuthication/authController.js"
import { authMiddleware } from "../middleware/authmiddleware.js"
import { rateLimiting } from "../RateLimiting/rateLimit.js"
const router=express.Router()
router.post("/signup",rateLimiting,signUp)
router.post("/login",rateLimiting,Login)
router.get("/auth-status",authMiddleware,checkAuth)
router.post("/logout",logout)
export default router