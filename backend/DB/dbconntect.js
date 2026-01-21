import mongoose from "mongoose";

const DatabaseConnect=async()=>{
    try {
        await mongoose.connect(process.env.MONG_URL)
        console.log("db connected successfully")
    } catch (error) {
        console.log("error at connection db",error)
        process.exit(1)
    }
}
export default DatabaseConnect