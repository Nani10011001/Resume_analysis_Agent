import {z,string} from "zod"
import { email } from "zod"
const envSchema=z.object({
    PORT:z.string().regex(/^\d+$/,"PORT must be a number"),
    MONG_URL:z.string().min(1,"MONGURL must be a string"),
    JWT_SECRETE:z.string().min(28,"---JWTScerete must be string"),
    NODE_ENV:z.string().min(1,"---node_env must be string---"),
    PASS_KEY:z.string().min(1,"PASS_KEY it should be string"),
    EMAIL_USER:z.string().min(1,"---EMAIL_USER-- it should be string"),
    FASTAPI_URL:z.string().min(1,"---FASTAPI_URL--- it should be string")





})
const parseSchema=envSchema.safeParse(process.env)
if(!parseSchema.success){
      console.log(`---environment variable error---`)
    parseSchema.error.issues.forEach(err => {
      
        console.log(`${err.path.join('.')}: `,err.message)
    });
    process.exit(1)
}
/* const data=
const splitdata=data.split("")
for(let i=0;i<=splitdata.length;i++){
    console.log(i)
} */
export const env=parseSchema.data
