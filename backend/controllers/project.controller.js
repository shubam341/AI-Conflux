import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';

export const createProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Ensure req.user exists
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const email = req.user.email;

        // Extract name from request body
        const { name } = req.body;

        // Find the logged-in user
        const loggedInUser = await userModel.findOne({ email });

        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = loggedInUser._id;

        // Service used to create project
        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);
    } catch (err) {
        console.error("Error in createProject:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


export const getAllProject=async(req,res)=>{
    try{

       const loggedInUser=await userModel.findOne({
        email:req.user.email
       }) 

    }catch(err){
        console.log(err)
        res.status(400).json({error:err.message})
    
    }
}
