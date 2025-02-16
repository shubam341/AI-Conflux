import projectModel from '../models/project.model';


export const createProject=async({
    name,userId
})=>{
    if(!name){
        throw new Error('Name is required')
    }

    if(!userId){
        throw new Error('User is required')
    }
    
}