/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../src/context/user.context";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token || !user) {
            navigate("/login");
        } else {
            setLoading(false);
        }
    }, [token, user, navigate]); // Add dependencies

    if (loading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default UserAuth;
