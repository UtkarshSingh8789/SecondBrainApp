import bcrypt from "bcrypt"
import user from "../models/userModel"
import { Request,Response } from "express"
import { AuthRequest } from "../middleware/authMiddleware"
const generateAccessTokenAndRefreshToken= async(userId:string)=>{
    try {
        const User=await user.findById(userId)
        if(!User){
            throw new Error("User not found");
        }
        const accessToken=User.generateAccessToken()
        const refreshToken=User.generateRefreshToken()
        User.refreshToken=refreshToken
        await User.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new Error("Something went wrong")
    }
}
export const registration= async(req:Request,res:Response)=>{
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            res.status(400).json({
                message:"All fields are required"
            })
            return;
        }
        const checkEmail=await user.findOne({
            email:email
        })
        if(checkEmail){
            res.status(404).json({
                message:"Email already exists"
            })
            return;
        }
        // hashing password;
        const hashPassword=await bcrypt.hash(password,5)
        const newUser=new user({
            username:username,
            email:email,
            password:hashPassword
        })
        await newUser.save()
        res.status(201).json({
            message: "User successfully created"
        })
        return;
    } catch(err: unknown){
        if (err instanceof Error) {
            console.log("Something wnet wrong while receving data", err.message);
        } else {
            console.log("Something wnet wrong while receving data", err);
        }
        res.status(500).send({
            message : "Something wnet wrong while receving data"
        })
        return;
    }
}
export const login= async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            res.status(400).json({message:"All fields are required"})
            return;
        }
        const User=await user.findOne({
            email:email
        })
        if(!User || !User.password){
            res.status(404).json({message:"User not found or password is missing"})
            return;
        }
        const isMatch=await bcrypt.compare(password,User.password);
        if(!isMatch){
            res.status(401).json({message:"invalid password"})
            return;
        }
        const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(User._id.toString())
        const options={
            httpOnly:true,
            secure:false
        }
        res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
            message:"user logged in successfully",
            accessToken,
            refreshToken
        })
        return;
    }catch(err){
        console.log("something wrong",err);
        res.status(500).json({
            message: "Something went wrong"
        })
        return;
    }  
}
export const logout=async(req:AuthRequest,res:Response)=>{
    try {
        await user.findByIdAndUpdate(req.userID,{
            $unset:{
                refreshToken:""
            }
        })
        const options={
            httpOnly:true,
            secure:false
        }
        res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            {
                message:"User logged out"
            }
        )
        return;
    } catch (error) {
        console.error("Logout failed:", error);
        res.status(500).json({ message: "Logout failed" })
    }
}
