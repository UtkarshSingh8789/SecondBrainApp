
import mongoose,{Types} from "mongoose";
const linkSchema=new mongoose.Schema({
    hash:{
        type:String,
        require:true
    },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        require:true
    }
})
const userLinks=mongoose.model('Link',linkSchema)
export default userLinks