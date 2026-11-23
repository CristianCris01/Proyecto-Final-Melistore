import { API_URL, leerRespuestaApi } from '../api';
import {useContext, useState} from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import './Login.css';



function Login () {
    const {setToken, setUser} = useContext(UserContext)
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    //const [ login ] = useContext (UserContext);
    const navigate = useNavigate();
    

  

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || password.length < 6) {
            alert("Por favor, complete todos los campos. La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const { token } = await leerRespuestaApi(respuesta);
            if (!token) throw new Error("La API no devolvió un token de sesión.");

            localStorage.setItem("token", token);
            setUser({ token });
            setToken(token);
            alert("Sesión iniciada con éxito");
            navigate("/");
        } catch (error) {
            alert(`No se pudo iniciar sesión. ${error.message}`);
        }
    };

    return (
        <form
            className="Login"
            onSubmit={handleSubmit}>
            <div className="ContainerLogin">

            <h1>Iniciar sesion</h1>

            <label htmlFor="email">Ingrese su correo electronico</label>

            <input
                className="inputRegister"
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label htmlFor="password">Ingrese su contrasena</label>

            <input
                className="inputRegister"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="********"
            />
            <br />
            <button className="buttonRegister" type="submit" >Iniciar sesion</button>
            
            <button className="buttonCancel" type="button" >Cancelar</button>
            </div>
        </form>
    );

};
export default Login;
