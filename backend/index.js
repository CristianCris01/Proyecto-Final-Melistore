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
  obtenerCarritoPorUsuario,
  cambiarCantidadCarrito,
  finalizarCompra,
  listarProductos,
  eliminarProducto

} = require('./consultas');



const app = express();

app.use(express.json());
app.use(cors());

const { PORT: port = 3000 } = require('./configuracion');

if (!secretKey) {
  console.error('Falta configurar JWT_SECRET en el backend.');
}

app.listen(port, async () => {
    console.log(`🟢 Servidor iniciado con exito en el puerto ${port}`);
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
    if (error.code === 401) {
      return res.status(401).json({ error: error.message });
    }

    console.error('Error en POST /login:', error.code, error.message);
    return res.status(500).json({ error: 'No se pudo iniciar sesión. Inténtalo más tarde.' });
  }
});

app.post('/productos', verificarToken, async (req, res) => {
  try {
    const { precio } = req.body;
    if(!Number.isInteger(precio)  || precio <= 0){
      return res.status(400).json({error: 'El precio debe ser un entero mayor que cero'})
    }

    const producto = await crearProducto(req.body);
    return res.status(201).json(producto);
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/productos/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id)
  if(!Number.isInteger(id)  || id <= 0){
    return res.status(400).json({error: 'ID invalido'});
  }
  try {
    const producto = await eliminarProducto(id);
    if(!producto){
      return res.status(404).json({error:'Producto no encontrado'});
    }
    return res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/cart/items', verificarToken, async (req, res) => {
  const productoId = req.body?.publication_id;
  if(!Number.isInteger(productoId) || productoId <= 0 || productoId > 999999){
    return res.status(400).json({error: 'ID de producto invalido'});
  }
  try {
    const item = await agregarAlCarrito(req.usuario.id, productoId);
    return res.status(201).json(item);
  } catch (error) {
    if(error.code === '23503') {
      return res.status(404).json({ error: 'Producto o usuario no encontrado'})
    }
    console.error(error);
    res.status(500).json({ error: 'Mo se puedo agregar el producto' });
  }
});

app.get('/cart', verificarToken, async (req, res) => {
  try {
    const items = await obtenerCarritoPorUsuario(req.usuario.id);
    return res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo consultar el carrito' });
  }
});

app.patch('/cart/items/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  const cambio = req.body?.cambio;
  if (!Number.isInteger(id) || id < 1 || id > 2147483647 || ![-1, 1].includes(cambio)) {
    return res.status(400).json({ error: 'Ítem o cambio de cantidad inválido' });
  }

  try {
    const item = await cambiarCantidadCarrito(req.usuario.id, id, cambio);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado en tu carrito' });
    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'No se pudo cambiar la cantidad' });
  }
});

app.post('/orders', verificarToken, async (req, res) => {
  try {
    const orden = await finalizarCompra(req.usuario.id);
    if (!orden) return res.status(409).json({ error: 'Tu carrito está vacío' });
    return res.status(201).json(orden);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'No se pudo finalizar la compra' });
  }
});

app.get('/productos', async (req, res) => {
  try{
    const productos = await listarProductos();
    res.json(productos);
  }
  catch (error){
    console.error('Error al obtener los productos: ', error);
    res.status(500).json({ error: 'Error interno del servidor'});

  }
});


module.exports = app;
