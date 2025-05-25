import mongoose,{Document,Types} from "mongoose";
import jwt from "jsonwebtoken"
interface IUser extends Document{
    _id:Types.ObjectId;
    username:string;
    email:string;
    password:string;
    refreshToken?:string;
    generateAccessToken():string;
    generateRefreshToken():string;
}
const userSchema=new mongoose.Schema<IUser>({
    username:{
        type: String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})
userSchema.methods.generateAccessToken=function():string{
    return jwt.sign({_id:this._id},process.env.ACCESS_TOKEN_SECRET!,{
        expiresIn:'1d'
    })
}
userSchema.methods.generateRefreshToken=function():string{
    return jwt.sign({_id:this._id},process.env.REFRESH_TOKEN_SECRET!,{
        expiresIn:'10d'
    })
}
const user=mongoose.model<IUser>("User",userSchema)
export default user