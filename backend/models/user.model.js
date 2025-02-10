import mongoose from "mongoose"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowecase:true,
        minLength:[6,'Email must be atleast 6 characters long'],
        maxLength:[50,'Email must not be longer than 60 characters']
    },

    password:{
        type:String,
    }
})

userSchema.statics.hashPassword=async function (password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.isValidPassword=async function(password){
    return await bcrypt.compare(password, this.password);
}