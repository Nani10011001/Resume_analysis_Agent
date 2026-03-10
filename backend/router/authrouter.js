import express from "express"
import { signUp,Login, OtpverifyPage, logout, checkAuth} from "../controller/Atuthication/authController.js"
import { authMiddleware } from "../middleware/authmiddleware.js"
const router=express.Router()
router.post("/signup",signUp)
router.post("/login",Login)
router.post("/otp-verify",OtpverifyPage)
router.get("/auth-status",authMiddleware,checkAuth)
router.post("/logout",logout)
export default router