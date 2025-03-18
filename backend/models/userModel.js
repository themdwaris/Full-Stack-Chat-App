import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:[true,"Name is required"]},
    email:{type:String,required:[true,"Email is required"],unique:true},
    password:{type:String,required:[true,"Password is required"]},
    avatar:{type:String,default:""}
},{timestamps:true})

const userModel = mongoose.models.user || mongoose.model("User",userSchema)

export default userModel