const request = require("supertest");
const server = require("./index");

describe("Pruebas de rutas de Melistore", () => {
  it("Obtiene 200 al iniciar sesión con credenciales válidas", async () => {
    const response = await request(server)
      .post("/login")
      .send({
        email: "pruebatest@gmail.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(200);
  });

  it("Obtiene 201 al registrar un usuario nuevo", async () => {
    const response = await request(server)
      .post("/usuarios")
      .send({
        nombre: "Usuario de prueba",
        email: `prueba${Date.now()}@gmail.com`,
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
  });

  it("Obtiene 401 al crear un producto sin token", async () => {
    const response = await request(server)
      .post("/productos")
      .send({
        titulo: "Teclado",
        description: "Teclado mecánico",
        precio: 25000,
        imagen_url: "https://example.com/teclado.jpg",
      });

    expect(response.statusCode).toBe(401);
  });

  it("Obtiene 401 al consultar un carrito sin token", async () => {
    const response = await request(server)
      .get("/cart/1");

    expect(response.statusCode).toBe(401);
  });
});