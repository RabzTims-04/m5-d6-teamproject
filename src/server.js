import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from 'cors'
import { join } from "path"
import productsRouter from './services/products/index.js'
import { catchAllErrors, badRequestMiddleware, notFoundMiddleWare } from "./errorMiddlewares.js"
import { getCurrentFolderPath } from "./lib/fs-tools.js"


const {PORT} = process.env
const server = express()
const publicFolderPath = join(getCurrentFolderPath(import.meta.url), "../public")

/* ************MIDDLEWARES***************** */

server.use(express.static(publicFolderPath))
server.use(cors())
server.use(express.json())

/* ************ENDPOINTS******************* */

server.use("/products", productsRouter)

/* ***********ERROR MIDDLEWARES************ */

server.use(notFoundMiddleWare)
server.use(badRequestMiddleware)
server.use(catchAllErrors)

console.table(listEndpoints(server));
server.listen(PORT,()=>{
    console.log("🧡 server is running on port: " + PORT);
})

server.on('error', (error)=> console.log('💔 Server is not running due to 🛠', error))