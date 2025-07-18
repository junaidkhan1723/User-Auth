/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
// context
export const AppContent = createContext();

//context provider
export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const [input, setInput] = useState('');
   
    // get user authentication 
    const getAuthState = async ()=>{
        try {

            const {data} = await axios.get(backendUrl + '/api/auth/is-auth');

            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }
            
        }  catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong");
            }
          }
    }
        // get user logged in data
    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong");
            }
          }
    }

    useEffect(()=>{
        getAuthState();

    },[]);
    
    const value = {      
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        input, setInput, navigate,token,
        setToken,axios, 
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};
