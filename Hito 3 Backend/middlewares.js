const jwt = require('jsonwebtoken');
const secretKey = require('./secretkey');


const reportarConsulta = (req, res, next) => {
  const url = req.url;
  console.log(`Hoy ${new Date()} se ha recibido una consulta en la ruta ${url}`);
  next();
};


const verificarToken = (req, res, next) => {
  try {
    const Authorization = req.header("Authorization");
    if (!Authorization) throw { code: 401, message: "Token no proporcionado" };

    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, secretKey); 
    const payload = jwt.decode(token); 
    req.email = payload.email; 

    next();
  } catch (error) {
    res.status(error.code || 401).send(error.message || "Token inválido");
  }
};

module.exports = { reportarConsulta, verificarToken };