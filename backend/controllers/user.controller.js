import userModel from '../models/user.model.js'
import * as userService from '../services/user.service.js';
import  {validationResult} from 'express-validator';
import redisClient from '../services/redis.service.js';


export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body); // Creating user

        //  Check if JWT function exists
        if (!user.generateJWT) {
            console.error("Error: generateJWT function is missing!");
            return res.status(500).json({ error: "JWT generation failed." });
        }

        // Generate Token
        const token = await user.generateJWT();

        console.log("Generated Token:", token); // Debugging 

        delete user._doc.password; // Remove password before sending response
        res.status(201).json({ user, token }); // Send user + token
    } catch (error) {
        console.error("Error Creating User:", error.message);
        res.status(400).send(error.message);
    }
};


export const loginController=async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{

        //Checking if User exits or not
const {email,password}=req.body;

const user=await userModel.findOne({email}).select('+password');

if(!user){
    return res.status(401).json({
        errors:'Invalid credentials'
    })
}

//IF user exist
const isMatch=await user.isValidPassword(password);

if(!isMatch){
    return res.status(401).json({
        errors:'Invalid credentials'
    })
}

//IS user Password Match
const token=await user.generateJWT();

res.status(200).json({user,token});

delete user._doc.password;

    }catch(err){
        res.status(400).send(err.message);
    }
}

export const ProfileController=async(req,res)=>{
      console.log(req.user);{
        res.status(200).json({
            user:req.user
        })
      }
}


export const logoutController =async(req,res)=>{
    
 
    try{

        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        redisClient.set(token,'logout','EX',60*60*24)

        res.status(200).json({
            message:'logged out successfully'
        })

    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
}
