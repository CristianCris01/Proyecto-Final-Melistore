import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const UserContext = createContext();


const  UserProvider = ({ children }) => {
    const [token, setToken] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token")
        setToken (false);
        setUser(null);
        navigate("/");
        return


    }

    useEffect( () => {
        const hayToken = localStorage.getItem("token") || false
        if(hayToken){
           setToken(hayToken)
            return
        }
        else{
            setToken(false)
            return
        }
        
    }, [])

    return (
        <UserContext.Provider value= {{token, logout, user, setUser, setToken}}>
            {children}
        </UserContext.Provider>
    )

};

export default UserProvider;