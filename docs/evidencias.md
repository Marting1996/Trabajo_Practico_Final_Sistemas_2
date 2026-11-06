# Evidencias

## 1. Tests automáticos

Herramientas: Jest + Supertest. Los tests son de integración y corren contra el servidor levantado en `127.0.0.1:8888`
con MongoDB disponible.

```bash
cd StudyMarket
npm install
npm run dev        # en una terminal, servidor en el puerto 8888
npm test           # en otra terminal
```

Resultado sobre `main` (con las etapas 4 y 5 integradas): **8 de 8 tests en verde**
(los 7 originales más el test del carrito agregado en la etapa 5).

| Archivo | Qué verifica |
|---------|--------------|
| `tests/productos.test.js` | Endpoint de productos |
| `tests/usuarios.test.js` | Registro, login (correcto e incorrecto) y perfil (con y sin token) |
| `tests/carrito.test.js` | Cálculo del total al agregar productos |

Límites: cubren 5 de los 19 endpoints y crean datos en la base real sin limpiarlos (RV-12).

## 2. Pruebas manuales

Archivo con las peticiones (REST Client de VS Code): [`pruebas-manuales.http`](pruebas-manuales.http).

| Caso | Petición | Resultado esperado | Resultado obtenido | Fecha |
|------|----------|--------------------|--------------------|-------|
| Ver un carrito por id | `GET /api/carritos/<id existente>` | 200 y el carrito | COMPLETAR (código y respuesta) | COMPLETAR |
| Recuperar contraseña con email inexistente | `POST /api/usuarios/forgot` con `{"email":"noexiste@example.com"}` | 404 "No se encontró un usuario con ese correo electrónico" | COMPLETAR (código y respuesta) | COMPLETAR |

## 3. Historial y trazabilidad

| Hito | Referencia |
|------|-----------|
| Estado inicial | tag `estado-inicial` (commit `d26e7ba`) |
| Diagnóstico | tag `etapa-diagnostico` |
| Tests de caracterización | PR #1 (`tests-caracterizacion`), merge `dbf90bb` |
| Etapa 4: SOLID y Clean Code | PR #2 (`etapa-4-solid-clean-code`), merge `b450f7b` |
| Etapa 5: refactorings | PR #3 (`refactoring`), merge `7b4baf0`; tags `etapa-refactoring`, `etapa-pruebas`, `estado-refactorizado` |
| README | PR #4 (`docs-readme`), merge `133206f` |
| Documentación | tag `etapa-docs` (al incorporar esta carpeta) |

Refactorings, cada uno en su commit:

| Técnica | Commit |
|---------|--------|
| Remove Dead Code (`obtenerLaPosicionDelProducto`) | `2b394e0` |
| Move Method (`autorizado` a `src/middlewares`) | `5f6d06d` |
| Extract Method (`calcularPrecioCarrito`) | `91932af` |
| Introduce Parameter Object (`datosAgregado` en `addProductToCart`) | `9b8a8dc` |

Cambio de comportamiento aceptado: el registro pasa de 200 a 201; se actualizaron 6 tests (`574ba03`).
