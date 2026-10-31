import request from "supertest";

const API = "http://127.0.0.1:8888/api";

describe("POST /api/carritos/add-product", () => {
  test("responde 200 y calcula el precio total", async () => {
    // Arrange: el servidor tiene que estar corriendo (npm run dev), el usuario registrado y hecho el login.
    //Además, el producto debe existir.

    const email = `prueba${Date.now()}@example.com`;

    const nuevoUsuario =   {
        "name": "Juan",
        "email": email,
        "password": "1234",
        "confirm_password": "1234"
    }

    const primerRegistro = await request(API).post("/usuarios/register").send(nuevoUsuario);
    expect(primerRegistro.status).toBe(201);

    const login = await request(API).post("/usuarios/login").send({ email: email, password: nuevoUsuario.password });
    const token = login.body.token;

    const producto = {
        "nombre":"Resumen de Progra I",
        "descripcion": "Resumen de la materia de las unidades 1 y 2.",
        "imagen": "imagen",
        "categoria": "Apuntes",
        "precio": 500
    };

    
    const creacionProducto = await request(API).post("/productos/cargar-producto").send(producto);
    expect(creacionProducto.status).toBe(200);

    const cid = login.body.usuario.carrito;
    const pid = creacionProducto.body._id;

    const cantidad = 2;

    // Act: mandar el pedido
    const respuesta = await request(API).post("/carritos/add-product").send({ cid: cid, pid: pid, cantidad: cantidad });
    

    
    // Assert: comprobar el resultado
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.precioTotal).toBe(cantidad * producto.precio);
  });
});