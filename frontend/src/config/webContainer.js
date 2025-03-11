import { WebContainer } from '@webcontainer/api';

// // Call only once
// const webcontainerInstance = await WebContainer.boot();

let webContainerInstance=null;

export const getWebContainer=()=>{
    if(webContainerInstance===null){
        webContainerInstance=new WebContainer();

    }
    return webContainerInstance;
}