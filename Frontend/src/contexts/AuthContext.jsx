import axios from "axios";
import httpStatus from "http-status";
import { Children, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// import server from '../environment.js'

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `http://localhost:8000/api/v1/users`
})

export const AuthProvider = ({ children }) => {

    const [userData, setUserData]  = useState(null);

    const router = useNavigate();

    const handleRegister = async(name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username, 
                password: password
            })

            if(request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
            
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            })
            console.log(username, password)
            console.log(request.data);

            if(request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                 router("/lobby")
            }
            
        } catch (err) {
            if (err.response && err.response.data) {
                console.log(err.response.data.message);
                throw new Error(err.response.data.message); // Throw user-friendly error
            } else {
                console.error("Login error:", err);
                throw new Error("An error occurred during login");
            }
        }
    }

    const data= {
        handleLogin, handleRegister
    }
    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}