import { API_URL } from '../api';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register ({onClose}) {
    const [nombre, setNombre] = useState("");
    const [ email, setEmail] = useState("");
    const [ password, setPassword] = useState("");
    const [ confirmPass, setConfirmPass] = useState("");
    const navigate = useNavigate();

    const handLeSubmit = async(e) => {
        e.preventDefault();

        if(!nombre.trim() || !email.trim() || !password || !confirmPass || password !== confirmPass || password.length < 6){
            alert("Por Favor, complete todos los campos. La contraseña debe tern almenos 6 caracteres");
            return;
        }
        else {
            let user = {nombre, email, password};
            let datos = JSON.stringify(user);

            const respuesta = await fetch(`${API_URL}/usuarios`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: datos,
            });
        
            let data = await respuesta.json();

            if (data.error){
                alert(data.error);
                return; 
            }
            else {
                alert("Registro exitoso");
                navigate("/Login");
            }
        }   
    }

    return (

       <form 
            className="registerForm"
            onSubmit={ (e) => {handLeSubmit(e)}}
            >
            <div className="ContainerRegister">
                <h1>Crea tu cuenta</h1>
            <br/>  
            <label htmlFor="nombre">Nombre</label>
            
            <input
                
                className="inputRegister"
                type="text"
                placeholder="Indicanos tu Nombre" 
                value={nombre}
                onChange={(e) => {setNombre(e.target.value);
                }}  required 
            ></input>
  
            
            <label htmlFor="email">Correo electrónico</label>
            
            <input
                
                className="inputRegister"
                type="email"
                placeholder="ejemplo@email.com" 
                value={email}
                onChange={(e) => {setEmail(e.target.value);
                }}  required 
            ></input>

            
            <label htmlFor="password">Contraseña</label>
            
            <input
                className="inputRegister"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => {setPassword (e.target.value)
                }}  required
            ></input>

            
            <label htmlFor="passwordCon">Confirma tu contraseña</label>
            
            <input
                className="inputRegister"
                type="password"
                placeholder="********"
                value={confirmPass}
                onChange={(e) => {setConfirmPass (e.target.value)
                }}  requiered
            ></input>
                
            <br />
            <div className="ButtonsRegister">
            <button className="buttonRegister" type="submit" >Registrarse</button>
            
            <button className="buttonCancel" type="button" onClick={onClose}>Cancelar</button>
            </div>
            </div>
        </form> 
    );
};
export default Register;