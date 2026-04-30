// RA_Agent/controllers/agentController.js
import { FileController } from "./Atuthication/FileController.js"
import { pyDataSend } from "./pyDataSend.js"

export const agentController = async (req, res) => {
    const { userId, content, resumeId } = req.body
/* taking the parameter of userinfo and the resumeid and pass to the python function
and get the info from it and send back to the frontend */

    try {
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized"
            })
        }

        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: "Upload a resume first"
            })
        }

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Please provide a query"
            })
        }


        res.setHeader("Content-Type", "text/plain")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")
        res.flushHeaders?.()   

        for await (const chunk of pyDataSend({ userId, content, resumeId })) {
            res.write(chunk)
           
        }

        console.log("streaming completed")
        res.end()

    } catch (error) {
        console.error(error)
        
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
        res.end()
    }
}


export const agentFileController = async (req, res) => {
    const { userId } = req.body
    const file = req.file
    try {
        const fileUpload = await FileController(userId, file)
        console.log('upload response:', fileUpload)

        res.status(200).json({
            success: true,
            resumeId: fileUpload.resume_id || fileUpload.resumeId || null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}