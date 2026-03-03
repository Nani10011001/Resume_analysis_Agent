import axios from "axios"

export async function* ({userId,content}){

    if(!userId){
     throw new Error("invalid userId please resgister")

    }
    try {
        const res=fetch("http://localhost:7001/chat",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(
               {
                 userId,
                content
               }
            )
        })
        if(!res.body){
            throw new Error("no response from the FastApi")

        }
        if(!res.ok){
            throw new Error(`fastapi returned ${ res.status}:,${(await res).text()}`)
        }
 const reader=res.body.getReader()
 const decoader=new TextDecoder()
 while(true){

    const {value,done}=await reader.read()

    if(done) break
    const decoded=decoader.decode(value,{stream:true})
    yield decoded
    console.log("decode python data response",decoded)
 }
    } catch (error) {
        console.error(error)
        throw new Error("error at fastApi config sever of it")
    }
}