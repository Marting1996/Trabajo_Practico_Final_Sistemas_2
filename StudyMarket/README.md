# StudyMarket

Descripción: StudyMarket es un marketplace para estudiantes: permite publicar, buscar y comprar material de estudio (apuntes y libros). Los usuarios se registran, inician sesión, publican productos y arman un carrito de compras.
El sistema viene de un proyecto previo. Se eligió porque cumple con los requisitos del TPI y porque su versión inicial tiene problemas reales de diseño e implementación que se pueden diagnosticar.

Este repositorio es el Trabajo Práctico Integrador de Metodología de Sistemas II (UTN). Contiene el sistema base (tag `estado-inicial`) y su versión refactorizada (tag `estado-refactorizado`).

## Tecnologías

| Capa	| Tecnología |
| --- | --- |
| Entorno |	Node.js (ES Modules)|
| Framework web	| Express 4.21 |
| Persistencia | MongoDB + Mongoose 8.7 |
| Autenticación	| Passport (estrategias local y jwt), jsonwebtoken, bcrypt |
| Sesiones	| express-session + connect-mongo |
| Vistas | express-handlebars |
| Email	| nodemailer (Gmail) |
| Otros | cors, cookie-parser, method-override, dotenv |
| Desarrollo |	nodemon, vite |
| Testing | Jest, Supertest |

## Instalación y uso

Requisitos: Node.js y MongoDB.

1. Clonar el repositorio y entrar a la carpeta `StudyMarket`.
2. Instalar las dependencias: `npm install`
3. Crear el archivo `.env` a partir de `.env.example`, con la dirección de MongoDB en `MONGO_REMOTO` y `MONGO_LOCAL`, y cualquier texto en `SECRET` y `JWT`.
4. Levantar el servidor: `npm run dev` (queda en `http://localhost:8888`).

### Tests

Con el servidor corriendo, en otra terminal: `npm test`

## Funcionalidades

| Módulo | Método y ruta | Funcionalidad | Estado |
| --- | --- | --- | --- |
| Usuarios | POST /api/usuarios/register | Registrar usuario (también crea su carrito) | Funciona |
| Usuarios | POST /api/usuarios/login | Iniciar sesión (JWT en cookie) | Funciona (la respuesta incluye el hash de la contraseña) |
| Usuarios | GET /api/usuarios/perfil | Ver perfil (ruta protegida) | Funciona |
| Usuarios | GET /api/usuarios/getall | Listar usuarios | Funciona (expone los hashes de las contraseñas) |
| Usuarios | GET /api/usuarios/email/:email | Buscar usuario por email | Funciona (expone el hash de la contraseña) |
| Usuarios | GET /api/usuarios/getone/:id | Buscar usuario por id | Falla (siempre 404) |
| Usuarios | PUT /api/usuarios/update/:id | Editar usuario | Falla (error 500) |
| Usuarios | DELETE /api/usuarios/delete/:id | Eliminar usuario | Falla (error 500) |
| Usuarios | POST /api/usuarios/forgot | Enviar mail de recuperación | Funciona si están configuradas las credenciales de mail |
| Usuarios | POST /api/usuarios/reset/:token | Restablecer contraseña | Funciona |
| Productos | GET /api/productos | Listar productos | Funciona |
| Productos | GET /api/productos/:id | Ver un producto | Funciona |
| Productos | POST /api/productos/cargar-producto | Publicar producto | Funciona |
| Productos | PUT /api/productos/:id | Editar producto | Falla |
| Productos | DELETE /api/productos/:id | Eliminar producto | Funciona (no pide autenticación) |
| Carrito | GET /api/carritos | Listar carritos | Funciona |
| Carrito | GET /api/carritos/:id | Ver un carrito | Corregido, sin verificar |
| Carrito | POST /api/carritos/add-product | Agregar producto al carrito | Funciona (el título queda vacío) |
| Carrito | DELETE /api/carritos/delete-product/:cid/:pid | Quitar producto del carrito | Falla (no elimina nada) |

## Documentación

La carpeta `/docs` contiene las pruebas manuales, el checklist de code review y las evidencias del trabajo.