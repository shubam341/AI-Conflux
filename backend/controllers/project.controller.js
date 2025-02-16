import projectModel from '../models/project.model'
import projectService from '../service/project.service'
import userModel from '../models/user.model';
import {validationResult} from 'express-validator'


export const createProject=async(req,res)=>{
    const errors=validationResult(req);

        
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    //     try{
    //        const project=await projectService.createProject(req.body)
    //        res.status(201).json(project)


    //        } catch (error){
    //         res.status(400).send(error.message);
    //        } 
    // }


    //taking names 
    const {name}=req.body;
    const loggedInUser=await userModel.findOne({email});
    const userId=loggedInUser._id;

}
