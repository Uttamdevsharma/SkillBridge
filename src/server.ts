
import app from "./app"
import { env } from "./config/env"
import { prisma } from "./lib/prisma"

const PORT = env.PORT || 5000

async function  main() {

    try{     
        await prisma.$connect()
        console.log("Database connected successfully")

        app.listen(PORT, () => {
            console.log(`server is run on port ${PORT}`)
        })

    }catch(error){
        console.error("an error occured", error)
        await prisma.$disconnect()
        process.exit(1)
    }

}

main()