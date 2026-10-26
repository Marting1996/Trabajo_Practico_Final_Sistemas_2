import request from "supertest";

const API = "http://127.0.0.1:8888/api";

describe("POST/api/usuarios/register", () => {
  test("responde 200 y el nombre, e-mail y id con cuerpo", async () => {
    // Arrange: el servidor tiene que estar corriendo (npm run dev) y además lo siguiente

    const email = `prueba${Date.now()}@example.com`;

    const nuevoUsuario =   {
        "name": "Juan",
        "email": email,
        "password": "1234",
        "confirm_password": "1234"
    }

    // Act: mandar el pedido
    const respuesta = await request(API).post("/usuarios/register").send(nuevoUsuario);

    // Assert: comprobar el resultado
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveProperty("id");
    expect(respuesta.body.email).toBe(email);
    expect(respuesta.body.name).toBe(nuevoUsuario.name);
  });


  test("responde 400 y un mensaje avisando que ya existe", async () => {
    // Arrange: el servidor tiene que estar corriendo (npm run dev) y el usuario ya debe existir

    const email = `prueba${Date.now()}@example.com`;

    const nuevoUsuario =   {
        "name": "Juan",
        "email": email,
        "password": "1234",
        "confirm_password": "1234"
    }

    const primerRegistro = await request(API).post("/usuarios/register").send(nuevoUsuario);
    expect(primerRegistro.status).toBe(200);

    // Act: mandar el pedido
    const respuesta = await request(API).post("/usuarios/register").send(nuevoUsuario);

    // Assert: comprobar el resultado
    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual([{ mensaje: "Ya existe un usuario con este correo" }]);
  });
});



