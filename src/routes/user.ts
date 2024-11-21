import {Router,Request,Response, NextFunction} from "express";
import {IUser,UserModel } from "../models/user";
import { UserErrors } from "../errorsfolder/errors";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
const router=Router();

router.post("/register",async(req:Request,res:Response)=>{
    const{username,password}=req.body;
    try{
    const user=await UserModel.findOne({username});
//If duplicate  is found error will be thrown
    if(user){
        return res.status(400).json({type:UserErrors.USERNAME_ALREADY_EXISTS});
    }

    //Hashing the password
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=new UserModel({username,password:hashedPassword});
    await newUser.save();
    res.json({message:"User Registered Successfully"});
    }catch(err){

       res.status(500).json({type:err}); 
    }


});

router.post("/login",async(req:Request,res:Response)=>{
    const{username,password}=req.body;
    try {
        const user:IUser=await UserModel.findOne({username});
        if(!user){
            return res.status(400).json({type:UserErrors.NO_USER_FOUND})
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({type:UserErrors.WRONG_CREDENTIALS});
        } 
       //If Password is valid It will send JWT Token
        const token=jwt.sign({id:user._id},"secret");
        res.json({token,userID:user._id});



    }catch(err){
        res.status(500).json({type:err});
    }
})

export const verifyToken=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers.authorization;
    if(authHeader){
        jwt.verify(authHeader,"secret",(err)=>{
         if(err){
            return res.sendStatus(403);
         }
         next();

        });
    }

}
 
export {router as userRouter};