import projectModel from '../models/project.model'
import projectService from '../service/project.service'
import userModel from '../models/user.model';
import {validationResult} from 'express-validator'


export const createProject=async(req,res)=>{
    const errors=validationResult(req);

        
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
try{
    //taking names 
    const {name}=req.body;
    const loggedInUser=await userModel.findOne({email});
    const userId=loggedInUser._id;

    //service used to create project
    const newProject=await projectService.createProject({name,userId});

    res.status(201).json(newProject)
}catch(err){
    console.log(err);
    res.status(400).send(err.message);
}
}
