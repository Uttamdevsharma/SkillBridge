import express from "express"
import { env } from "./config/env"
import cors from 'cors'
import authRouter from "./modules/auth/auth.routes"
import { notFound } from "./middleware/notFound"
import { globalErrorHandler } from "./middleware/globalErrorHandler"
import adminRouter from "./modules/admin/admin.routes"

const app = express()

app.use(express.json())

app.use(cors({
    origin : env.FRONTEND_URL,
    credentials : true
}

))



app.use("/api/auth",authRouter)
app.use("/api/admin", adminRouter)

app.use(notFound)
app.use(globalErrorHandler)


export default app