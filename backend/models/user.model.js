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
        required: true,
        select:false,
    }
})

//  Hash Password Before Saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.statics.hashPassword=async function (password){
    return await bcrypt.hash(password,10);
}


// Check if Password is Valid (Explicitly Select Password)
userSchema.methods.isValidPassword = async function (password) {
    const user = await mongoose.model('user').findById(this._id).select("+password");
    return user ? await bcrypt.compare(password, user.password) : false;
};


// Generate JWT (Includes Email & ID)
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { id: this._id, email: this.email },  // Include User ID
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const User=mongoose.model('user',userSchema);

export default User;