CREATE DATABASE melistore;

CREATE TABLE productos(
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    precio INT NOT NULL,
    imagen_url VARCHAR(500) NOT NULL
    
);
CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE cart(
    id SERIAL PRIMARY KEY,
    nombre_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    CONSTRAINT cart_usuario_producto_unique UNIQUE (nombre_id, titulo_id)

);

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    estatus VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    user_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    total INT NOT NULL
    );
