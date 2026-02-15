import express from "express"
import { signUp,Login, OtpverifyPage} from "../controller/Atuthication/authController.js"
const router=express.Router()
router.post("/signup",signUp)
router.post("/login",Login)
router.post("/otp-verify",OtpverifyPage)
export default router