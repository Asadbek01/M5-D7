import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import BlogsRouter from "./services/files/index.js"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

// **************************** MIDDLEWARES **********************************
const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]

const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true)
    } else {
      next(new Error("CORS ERROR!"))
    }
  },
}


server.use(cors(corsOptions))
server.use(express.json())

// **************************** ENDPOINTS ************************************

server.use("/blogs", BlogsRouter)

// **************************** ERROR HANDLERS *******************************

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
