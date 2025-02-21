import projectModel from '../models/project.model.js';


export const createProject=async({
    name,userId
})=>{
    if(!name){
        throw new Error('Name is required')
    }

    if(!userId){ 
        throw new Error('User is required')
    }
    
//creating project 

let project;
try{
    project=await projectModel.create({
        name,
        users:[userId]
    });

} catch(error){
if(error.code===11000){
    throw new Error('Project name already exists');
}
throw error;
}

return project;
}



export const getAllProjectByUserId=async({userId})=>{
    if(!userId){
        throw new Error('UserId is required')
    }

const allUserProjects=await projectModel.find({
    users:userId
})

return allUserProjects

}


export const addUsersToProject=async({projectId, users})=>{

    if(!projectId){
        throw new Error("projectId is required")
    }
}