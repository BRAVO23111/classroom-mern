import mongoose from "mongoose";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { userRouter } from "./Controllers/Auth.js";
import { classroomRouter } from "./Controllers/ClassroomRouter.js";
import { TeacherRouter } from "./Controllers/Teacher.js";
import { StudentRouter } from "./Controllers/Student.js";


dotenv.config();


const db = mongoose.connect(process.env.MONGO_URI)
try {
    if(db){
        console.log("database connected");
    }
} catch (error) {
    console.log(error);
}


const app = express();

app.use(cors({
    origin : ["https://classroom-mern-silk.vercel.app/"],
    methods : ["GET", "POST" ,"PUT","DELETE"],
    credentials :true
}));

app.use(express.json())
app.use("/auth",userRouter);
app.use("/classroom" ,classroomRouter);
app.use("/teacher" ,TeacherRouter)
app.use("/student", StudentRouter)


app.listen(3000,(req,res)=>{
    console.log("Server at 3000")
})