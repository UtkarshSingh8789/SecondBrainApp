import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import userContent from "../models/contentModel";
export const newContent=async(req:AuthRequest,res:Response)=>{
    try {
        const {link,contentType,title,tag}=req.body
        const userid=req.userID
        if(!link || !contentType || !title || !tag || !userid){
            res.status(400).json({message:"All fields are compulsory"})
            return;
        }
        const contentCreated=new userContent({
            link:link,
            contentType:contentType,
            title:title,
            tag:tag,
            userId:userid
        })
        await contentCreated.save();
        res.status(200).json({
            message: "Content saved Successfully"
        })
        return;
    }catch(err){
        console.log("Err(catch): something went wrong",err)
        return;
    }
}
export const content =async(req:AuthRequest,res:Response)=>{
    try {
        const userid=req.userID;
        if(!userid){
            res.status(400).json({message:"Something wrong"})
            return;
        }
        const userData=await userContent.find({userId:userid})
        console.log(userData)
        res.status(200).json({
            message:"user data fetched successfully",
            data:userData,
        })
        return;
    } catch (err) {
        console.log("Err(catch): something went wrong",err)
        return;
    }
}
export const deleteContent=async (req:AuthRequest,res:Response)=>{
    try {
        const userid=req.userID;
        const userTitle=req.params.contentId;
        if(!userid || !userTitle){
            res.status(400).json({message:"User ID or Content ID missing"})
            return;
        }
        const content=await userContent.findOne({title:userTitle,userId:userid});
        if(!content){
            res.status(404).json({message:"content not found or unAuthorized"})
            return;
        }
        await userContent.findByIdAndDelete(content)
        res.status(200).json({ message: "Content deleted successfully" });
        return;
    } catch (err) {
        console.log("Err(catch): something went wrong",err)
        return;
    }
}
export const shareContent=async(req:AuthRequest,res:Response)=>{
    const {userId}=req.params
    try {
        const documents = await userContent.find({ userId });
        res.status(200).json({ data: documents });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        return;
    }
}