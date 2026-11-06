# Decisiones técnicas

| # | Decisión | Motivo |
|---|----------|--------|
| 1 | Escribir tests de caracterización antes de refactorizar y subirlos primero a `main` (PR #1), fijando incluso el comportamiento incorrecto (el login devuelve el hash). | Sirven de red de seguridad para las etapas 4 y 5. |
| 2 | Un commit por refactoring, con la suite completa corrida después de cada uno; los refactorings puros (`refactor:`) se separan de las correcciones de bugs. | Cada cambio es atómico y se puede revertir o seguir. |
| 3 | Antes de cada refactoring, simular la integración con la rama de la etapa 4 e integrarla en `main` antes del Introduce Parameter Object. | Ambas ramas modificaban la llamada a `addProductToCart` en `carrito-controller.js`. |
| 4 | Aceptar el cambio de 200 a 201 en el registro y actualizar 6 tests (5 en `usuarios.test.js`, 1 en `carrito.test.js`). | 201 es el código correcto para un recurso creado. |
| 5 | Distinguir dos tipos de código muerto: eliminar las funciones que nadie llama y dejar las que se llaman pero no funcionan. | Eliminar las segundas es una corrección y cambia el comportamiento. |
| 6 | No incorporar más cambios de comportamiento en esta entrega; dejarlos como mejoras pendientes. | Cada uno necesita tests nuevos antes de aplicarse. |
| 7 | Usar `127.0.0.1` en lugar de `localhost` en los tests. | En Windows `localhost` resultó lento. |
| 8 | Pasar el token a mano en el encabezado `Cookie` para probar `/perfil`. | La cookie `jwt` tiene la marca `Secure` y REST Client no la envía por http. |

## Mejoras pendientes (orden sugerido: seguridad, integridad, funcionalidad)

| # | Mejora | Smell | Tests necesarios |
|---|--------|-------|------------------|
| 1 | Editar y eliminar usuario con MongoDB (`findByIdAndUpdate`, `findByIdAndDelete`) | S05 | PUT y DELETE con 200 y con 404 |
| 2 | Editar producto: quitar el parámetro `index` de `actualizarProducto` | S01 | `PUT /productos/:id` guarda los cambios |
| 3 | Quitar producto del carrito: filtrar por el campo correcto y recalcular el total | S02 | El producto desaparece y el total baja |
| 4 | Proteger rutas abiertas con `autorizado` | S03 | 401 sin token |
| 5 | Filtrar el hash en login y `getall`, quitar logs de credenciales | S03 | Respuesta sin `password` |
| 6 | Cambiar `require` por `required` en los schemas | S06 | Error al omitir campos obligatorios |
| 7 | Dividir `usuarios-controller.js` y separar la creación del carrito del registro | S07, S09 | Los mismos tests siguen en verde |
| 8 | Tests aislados (base de prueba, `afterAll`) y medición de cobertura | Etapa 6 | — |
