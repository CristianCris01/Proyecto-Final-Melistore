import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
export const UserContext = createContext();


const  UserProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/", { replace: true });
        window.scrollTo(0, 0);
    }

    return (
        <UserContext.Provider value= {{token, logout, user, setUser, setToken}}>
            {children}
        </UserContext.Provider>
    )

};

export default UserProvider;