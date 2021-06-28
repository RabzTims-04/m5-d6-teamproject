import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from 'cors'
import { join } from "path"

const {PORT} = process.env
const server = express()

server.use(cors())
server.use(express.json())

console.table(listEndpoints(server));
server.listen(PORT,()=>{
    console.log("🧡 server is running on port: " + PORT);
})

server.on('error', (error)=> console.log('💔 Server is not running due to 🛠', error))