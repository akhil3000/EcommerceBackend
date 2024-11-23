import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import{userRouter} from "./routes/user";
import { productRouter } from './routes/product';

const app=express();

app.use(express.json());
app.use(cors());

app.use("/user",userRouter);
app.use("/product",productRouter);

mongoose.connect("mongodb+srv://Akhil:Akhil1234@cluster0.ghgsmj9.mongodb.net/FullStackEcommerce2?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Connected to MongoDB");
})



app.listen(3002,()=>console.log("Server Started"));
