const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = require('./secretkey');
const { verificarToken } = require('./middlewares');
const cors = require("cors");
const {
  checkConnection,
  registrarUsuario,
  verificarCredenciales,
  crearProducto,
  agregarAlCarrito,
  obtenerCarritoPorUsuario
} = require('./consultas');



const app = express();

app.use(express.json());
app.se(cors());

app.listen(3000, async () => {
    console.log("🟢 Servidor iniciado con exito en -->http://localhost:3000 <--");
    try {
        const hora = await checkConnection();
        console.log("Base de datos conectada y funcionando a las " + hora);

    }catch(error){
        console.log("Error en la conexion a la DB: ", error.message);
    }

});

app.post('/usuarios', async (req, res) => {
  try {
    const nuevoUsuario = await registrarUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await verificarCredenciales(email, password);
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, secretKey);
    res.json({ token });
  } catch (error) {
    res.status(error.code || 500).json({ error: error.message });
  }
});

app.post('/productos', verificarToken, async (req, res) => {
  try {
    const producto = await crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/cart', verificarToken, async (req, res) => {
  try {
    const item = await agregarAlCarrito(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/cart/:usuario_id', verificarToken, async (req, res) => {
  try {
    const carrito = await obtenerCarritoPorUsuario(req.params.usuario_id);
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = app;
