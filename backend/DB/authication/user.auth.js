import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,

    },
    emailOtp:{
        type:String,
  

    },
otpExpiry:{
type:Date,
},
  isVerifeid:{
    type:Boolean,
    default:false
  }

},{timestamps:true
})
export const User=mongoose.model("userauth",userSchema)
