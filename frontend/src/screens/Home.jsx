/* eslint-disable no-unused-vars */
import React, {useContext} from "react";
import {UserContext} from '../context/user.context'

const Home=()=>{

    const {user}=useContext(UserContext)
    return(
<div>Home</div>
    )
}
export default Home