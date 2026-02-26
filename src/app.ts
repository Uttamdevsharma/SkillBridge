import express from "express"
import { env } from "./config/env"
import cors from 'cors'
import authRouter from "./modules/auth/auth.routes"
import { notFound } from "./middleware/notFound"
import { globalErrorHandler } from "./middleware/globalErrorHandler"

const app = express()

app.use(express.json())

app.use(cors({
    origin : env.FRONTEND_URL,
    credentials : true
}

))



app.use("/api/auth",authRouter)

app.use(notFound)
app.use(globalErrorHandler)


export default app