import {useContext, useState} from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import './Login.css';



function Login () {
    const {token, setToken, setUser} = useContext(UserContext)
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    //const [ login ] = useContext (UserContext);
    const navigate = useNavigate();
    

  

    const handleSubmit = async(e) => {
        e.preventDefault();
    

        if(!email || !password || password.length < 6){
            alert("Por favor, complete todos los campos. La contraseña debe tener al menos 6 caracteres.");
        }
         else { 
            const respuesta = await fetch("https://backend-r0ho.onrender.com/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),

            });
            let data = await respuesta.json();

            if (data.error) {
                alert(data.error);
                return;
            }
            else {
                alert("Sesion inicida con exito");
                let usuarioLogeado = {
                    token: data.token
                    
                }
                setUser(usuarioLogeado);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                console.log(usuarioLogeado);
                navigate("/");
                
            }
        }   
    }

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
