# Checklist de code review (etapa 7)

Revisión del estado integrado de la rama `main` (etapas 4 y 5 incorporadas, tag `estado-refactorizado`).
Alcance: módulos Usuarios, Productos y Carrito, configuración (`server.js`, `utils/`) y los 8 tests de `tests/`.
Quedan fuera las vistas Handlebars y el prototipo estático (`views02` y `public`).

El checklist sigue las categorías del "Checklist de revisión" de la presentación de Clean Code de la cátedra
(lógica y funcionalidad, legibilidad, diseño y arquitectura, seguridad, rendimiento) más dos filas
de feedback profesional: pruebas y documentación con trazabilidad.

Severidad de las observaciones: **Alta** (rompe comportamiento o compromete seguridad o datos),
**Media** (encarece o vuelve riesgoso el cambio), **Baja** (estilo o documentación).

## 1. Checklist aplicado

| # | Categoría | Pregunta de revisión | Resultado | Evidencia |
|---|-----------|----------------------|-----------|-----------|
| 1 | Lógica y funcionalidad | ¿Hace lo que debe? ¿Cubre casos de borde y de error? | Parcial | Editar producto, quitar del carrito, editar usuario y eliminar usuario siguen fallando (S01, S02, S05). Carrito y recuperación de contraseña usan try/catch, pero los catch nuevos no registran el error. **Bien:** `/forgot` ya no tira abajo el servidor y `editUsuario`/`eliminarUsuario` devuelven un 500 controlado en JSON. |
| 2 | Legibilidad | ¿Los nombres son descriptivos? ¿La estructura sigue las convenciones? | Parcial | Persisten `obteneterLaPosicionDelUsuario`, rutas que mezclan idiomas (`getall`, `cargar-producto`, `add-product`) y el número mágico `3600000`. **Bien:** se corrigió `editUsuatio` y se quitaron los `console.log` comentados del carrito. |
| 3 | Diseño: responsabilidad única | ¿Cada módulo tiene una sola razón de cambio? | Parcial | `createUser` delega la validación en `validarDatosRegistro` (etapa 4) y `autorizado` pasó a `auth-middleware.js` (etapa 5). `usuarios-controller.js` sigue reuniendo login, mails, reset y vistas (S07). |
| 4 | Diseño: acoplamiento y capas | ¿Está en la capa correcta? ¿Hay acoplamiento innecesario? | No cumple | `carrito-models.js` importa `productos-controller.js` y el controller de usuarios crea carritos. Ninguna etapa lo corrigió. |
| 5 | Seguridad: datos sensibles | ¿Hay datos sensibles expuestos? | No cumple | Login y `getall` devuelven el hash. Se imprimen contraseñas en `usuarios-models.js:64, :113, :116` y `usuarios-controller.js:241, :244`, el usuario completo en `handle-passport.js:10` y el token en `handle-jwt.js:13, :24, :32`. **Bien:** el login responde igual si el usuario no existe o la contraseña es incorrecta; la cookie `jwt` va con `httpOnly` y `secure`. |
| 6 | Seguridad: autorización y validación de entradas | ¿Se manejan bien las autorizaciones? ¿Se validan los inputs? | No cumple | Siguen abiertas las rutas de S03: `autorizado` solo se usa en `GET /perfil`. Los tres schemas usan `require` en vez de `required` (S06). **Bien:** el middleware existe en su propio archivo y el token JWT vence a la hora. |
| 7 | Rendimiento | ¿Hay bucles innecesarios o consultas ineficientes? | Sin hallazgos | El diagnóstico de las etapas 3 a 6 no registró problemas. No se midió. |
| 8 | Código muerto y ruido | ¿Quedan comentarios, logs o código sin uso? | Parcial | Se eliminó `obtenerLaPosicionDelProducto` (etapa 5). Quedan tres funciones en `usuarios-models.js` conectadas a rutas activas, bloques comentados y `console.log`. |
| 9 | Pruebas | ¿Hay tests que protejan lo que se cambia? | Parcial | 8 tests pasan, pero cubren 5 de 19 endpoints; necesitan el servidor en `127.0.0.1:8888` y crean datos en la base real sin limpiarlos. **Bien:** los tests de caracterización se escribieron antes de refactorizar y detectaron el único cambio de comportamiento (200 a 201). |
| 10 | Documentación y trazabilidad | ¿Cada cambio es atómico y se puede seguir? | Parcial | Commits separados por refactoring y PRs #1 a #4. Tags `estado-inicial`, `estado-refactorizado`, `etapa-diagnostico`, `etapa-refactoring` y `etapa-pruebas`; `etapa-docs` se agrega al incorporar esta carpeta. |

Resumen: 6 Parcial, 3 No cumple, 1 Sin hallazgos.

## 2. Observaciones y feedback profesional

15 observaciones: 7 Alta, 5 Media, 3 Baja. Cuatro no cambian la API (RV-01, RV-10, RV-13, RV-15).
Prioridad: RV-01 a RV-04 primero.

| ID | Ubicación | Observación y feedback | Sev. | Acción |
|----|-----------|------------------------|------|--------|
| RV-01 | `usuarios-models.js:64,:113,:116`; `usuarios-controller.js:241,:244`; `handle-passport.js:10`; `handle-jwt.js:13,:24,:32` | Contraseñas (texto plano y hash) y token se imprimen en la terminal; el login imprime el usuario completo. Quitar esos `console.log`. | Alta | Pendiente (no cambia la API) |
| RV-02 | `usuarios-controller.js:136` (login) y `getAll` | Login y `getall` devuelven el hash. El test de login afirma que `password` viene en la respuesta, así que filtrarlo obliga a cambiar ese test. | Alta | Pendiente |
| RV-03 | Rutas de productos, carritos y `getall` | No piden autenticación. Aplicar `autorizado` y probar el 401 sin token. | Alta | Pendiente |
| RV-04 | `usuarios-controller.js` (`editUsuario`, `eliminarUsuario`); `usuarios-models.js:54-95` | Usan funciones sobre una lista en memoria que ya no existe. Con el try/catch de la etapa 4 responden un 500 controlado, pero editar y borrar no funcionan. | Alta | Pendiente |
| RV-05 | `productos-models.js:52` | El parámetro `index` sobrante deja la edición de producto sin efecto (S01). | Alta | Pendiente |
| RV-06 | `carrito-models.js` | `removeProductFromCart` filtra por un campo inexistente y no recalcula el total. Reutilizar `calcularPrecioCarrito` (S02). | Alta | Pendiente |
| RV-07 | Los 3 schemas | `require` en lugar de `required`. Activar la validación puede rechazar datos que hoy se guardan, por eso va con tests (S06). | Alta | Pendiente |
| RV-08 | `enviarMailRecuperacion` | El 404 "No se encontró un usuario con ese correo" revela qué emails están registrados (el login responde igual en ambos casos) y el 500 devuelve `errorDelServidor.message`. Usar un mensaje genérico. | Media | Pendiente |
| RV-09 | `carrito-controller.js` (`getOne`), `enviarMailRecuperacion`, `editUsuario` | La etapa 4 cambió comportamiento externo sin test ni registro en la etapa 6 (por ejemplo, `/forgot` pasó de tirar el servidor a responder 404). | Media | Pendiente: agregar tests y registrarlo |
| RV-10 | `enviarMailRecuperacion` | Se reemplazó `1000 * 60 * 60` por `3600000` más un comentario, menos legible. Usar una constante con nombre. | Baja | Pendiente (no cambia la API) |
| RV-11 | `validarDatosRegistro` | La regex del nombre (solo a-z y espacios) rechaza tildes y ñ (Martín, Gómez). | Media | Pendiente |
| RV-12 | `tests/` | Dependen del servidor levantado, escriben en la base real sin limpiar y cubren 5 de 19 endpoints. Usar base de prueba y `afterAll`. | Media | Pendiente |
| RV-13 | Informe, etapa 3 | La tabla resumen dice S08 método largo y S09 acoplamiento, pero el detalle titula "S08. Acoplamiento adecuado". | Baja | Pendiente (solo informe) |
| RV-14 | `carrito-controller.js` y `usuarios-controller.js` | Los catch nuevos no registran el error; Clean Code pide no silenciar errores. Registrar la falla antes de responder el 500. | Media | Pendiente |
| RV-15 | Informe, etapa 4, mejora 1 | El informe nombra `editarUsuario` y el código dice `editUsuario`. | Baja | Pendiente (solo informe) |

### Lo que está bien hecho

- El login responde lo mismo con usuario inexistente y con contraseña incorrecta, sin revelar qué emails existen.
- Los tests de caracterización se escribieron antes de refactorizar y entraron primero a `main` (PR #1); detectaron el cambio de 200 a 201.
- Cada refactoring va en un commit separado, con la suite completa corrida después de cada uno.
- `calcularPrecioCarrito` y `auth-middleware.js` quedaron listos para reutilizarse.

## 3. Correcciones realizadas

| Corrección | Dónde | Verificación | Estado |
|------------|-------|--------------|--------|
| El router llamaba a `editUsuatio` después del renombre y el servidor no arrancaba | `user-router.js:27` | Claudia, en su máquina | Hecho (commit `bb0a19b`) |
| `Number(req.params.id)` convertía el id de Mongo en NaN y el carrito por id daba siempre 404 | `carrito-controller.js`, `getOne` | COMPLETAR: resultado de la prueba manual (ver `evidencias.md`) | Hecho (commit `bb0a19b`) |
| El tag `etapa-refactoring` estaba puesto en la rama y en el primer commit | Repositorio | Revisión asistida por IA | Hecho (tag corregido) |

## 4. Criterios de aceptación técnica (TAC)

| Criterio | Estado | Detalle |
|----------|--------|---------|
| El código arranca y pasa todos los tests | Cumple | `npm test` da 8 de 8 en verde sobre `main`. |
| No rompe funcionalidades existentes | Cumple | El único cambio aceptado (registro de 200 a 201) se detectó con los tests y se registró en la etapa 6. |
| Respeta SOLID y DRY | Parcial | SRP en `createUser` y en el middleware; pendientes S07 y S09. |
| Maneja los errores sin ocultarlos | Parcial | try/catch en carrito y usuarios, pero los catch no registran el error (RV-14). |
| Seguridad y datos sensibles | No cumple | Hash en respuestas, credenciales en logs y rutas abiertas (RV-01, RV-02, RV-03). |
| Cambios de comportamiento con test y registrados | Parcial | Los de la etapa 4, salvo el 201, no tienen test (RV-09). |
| Cambio atómico y trazable | Cumple | Un commit por refactoring y pull requests #1 a #4. |
| Revisión por pares | Parcial | La rama de la etapa 4 se revisó contra el informe, con verificaciones de Claudia y apoyo de IA. |
| No genera deuda técnica innecesaria | Cumple | Las observaciones Alta sin corregir están documentadas con su motivo. |
