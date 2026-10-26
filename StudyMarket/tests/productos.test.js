import request from "supertest";

const API = "http://localhost:8888/api";

describe("GET /api/productos", () => {
  test("responde 200 y devuelve una lista", async () => {
    // Arrange: el servidor tiene que estar corriendo (npm run dev)

    // Act: mandar el pedido
    const respuesta = await request(API).get("/productos");

    // Assert: comprobar el resultado
    expect(respuesta.status).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });
});