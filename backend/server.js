import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

//DB connection
connectDB();

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

// mongodb+srv://mael:SuperPass2606f@127.0.0.1:27017

