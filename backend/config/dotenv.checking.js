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
