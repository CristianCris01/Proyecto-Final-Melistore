const { Pool } = require("pg");
const bcrypt = require("bcryptjs")


const pool = new Pool({
    host: "aws-1-us-east-1.pooler.supabase.com",
    port:"5432",
    user: "postgres.okpdwsukbglkaxozpxod",
    password: "Poyoko2408.",
    database: "postgres",
    allowExitOnIdle: true

});


async function checkConnection() {
    const result = await pool.query("SELECT NOW()")
    const hora = result.rows[0].now
    return hora    
}
module.exports = { pool, checkConnection}

const registrarUsuario = async ({ nombre, email, password }) => {
  const passwordEncriptada = bcrypt.hashSync(password, 10);
  const consulta = "INSERT INTO usuarios (nombre, password, email) VALUES ($1, $2, $3) RETURNING id, nombre, email";
  const values = [nombre, passwordEncriptada, email];
  const { rows } = await pool.query(consulta, values);
  return rows[0];
};


const verificarCredenciales = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: [usuario], rowCount } = await pool.query(consulta, [email]);

  if (!rowCount || !bcrypt.compareSync(password, usuario.password)) {
    throw { code: 401, message: "Email o contraseña incorrecta" };
  }
  return usuario;
};

const crearProducto = async ({ titulo, description, precio, imagen_url }) => {
  const consulta = "INSERT INTO productos (titulo, description, precio, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *";
  const values = [titulo, description, precio, imagen_url];
  const { rows } = await pool.query(consulta, values);
  return rows[0];
};

const eliminarProducto= async (id) => {
  const consulta = "DELETE FROM productos WHERE id = $1 RETURNING id";
  const { rows } = await pool.query(consulta, [id]);
  return rows[0];
};


const agregarAlCarrito = async (usuarioId, productoId) => {
  const consulta = ` INSERT INTO cart (nombre_id, titulo_id, cantidad) VALUES ($1, $2, 1)
  oN CONFLICT (nombre_id, titulo_id) DO UPDATE SET cantidad = cart.cantidad + 1 RETURNING *`;
  const { rows } = await pool.query(consulta, [usuarioId,productoId]);
  return rows[0];
};

const obtenerCarritoPorUsuario = async (usuario_id) => {
  
  const consulta = `
    SELECT c.id, p.id AS producto_id, p.titulo, p.precio, p.imagen_url, c.cantidad, p.precio * c.cantidad AS subtotal
    FROM cart c
    INNER JOIN productos p ON c.titulo_id = p.id
    WHERE c.nombre_id = $1
    ORDER BY c.id
  `;
  const { rows } = await pool.query(consulta, [usuario_id]);
  return rows;
};

const listarProductos = async () => {
  const productos = `SELECT id, titulo, description, precio, imagen_url FROM productos`;
  const {rows} = await pool.query(productos);
  return rows;
};

const cambiarCantidadCarrito = async (usuarioId, itemId, cambio) => {
  const { rows } = await pool.query(
    'UPDATE cart SET cantidad = GREATEST(1, cantidad + $3) WHERE nombre_id = $1 AND id = $2 RETURNING id, cantidad',
    [usuarioId, itemId, cambio]
  );
  return rows[0];
};

const finalizarCompra = async (usuarioId) => {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');
    const { rows: items } = await cliente.query(
      `SELECT c.id, c.cantidad, p.precio
       FROM cart c JOIN productos p ON p.id = c.titulo_id
       WHERE c.nombre_id = $1
       ORDER BY c.id
       FOR UPDATE OF c`,
      [usuarioId]
    );

    if (items.length === 0) {
      await cliente.query('ROLLBACK');
      return null;
    }

    const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const { rows: [orden] } = await cliente.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, total, estatus',
      [usuarioId, total]
    );
    const ids = items.map((item) => item.id);
    await cliente.query('DELETE FROM cart WHERE nombre_id = $1 AND id = ANY($2::int[])', [usuarioId, ids]);
    await cliente.query('COMMIT');
    return { ...orden, items_comprados: ids };
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
};

module.exports = {
  pool, 
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
};
