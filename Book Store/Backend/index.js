import express, { urlencoded } from 'express'
import cors from 'cors'
import env from 'dotenv'
import Connect from './Database/Connect.js'
import Router from './Routes/Routes.js'
import cookieParser from 'cookie-parser';

let app = express()
Connect()
env.config()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser());
app.use(urlencoded({extended : true}))
app.use('/', Router)


app.listen(process.env.PORT, ()=>{
    console.log("Server Running");
})