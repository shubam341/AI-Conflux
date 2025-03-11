import { WebContainer } from '@webcontainer/api';

// // Call only once
// const webcontainerInstance = await WebContainer.boot();

let webContainerInstance=null;

export const getWebContainer= async()=>{
    if(webContainerInstance===null){
        webContainerInstance=await WebContainer.boot();

    }
    return webContainerInstance;
}