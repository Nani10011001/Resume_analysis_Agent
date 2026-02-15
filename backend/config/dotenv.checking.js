import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
const filename=fileURLToPath(import.meta.url)
const dirname=path.dirname(filename)
dotenv.config({
    path:path.resolve(dirname,"../.env")
})
if(!process.env.MONG_URL) console.log("---it is mongurl is undefined---")
if(!process.env.PORT) console.log("---PORT is undefined---")
if(!process.env.NODE_ENV) console.log("--NODE_ENv__ is undefined")
if(!process.env.EMAIL_USER) console.log("---EMAIL_USER--- is undefine")
if(!process.env.PASS_KEY) console.log("---PASS_KEY--- is undefine")
if(!process.env.FASTAPI_URL) console.log("---FASTAPI_URL--- is undefine")