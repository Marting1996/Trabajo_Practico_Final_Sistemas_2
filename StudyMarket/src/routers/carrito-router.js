import express from 'express'
import controladorCarrito from '../controllers/carrito-controller.js'

const routerCarrito = express.Router()

//! READ ALL
routerCarrito.get('/', controladorCarrito.getAll)

//! READ ONE
routerCarrito.get('/:id', controladorCarrito.getOne)

//! AÑADIR PRODUCTO
// cid: cart id
//pid: product id
routerCarrito.post('/add-product', controladorCarrito.addProductToCartController)

//! ELIMINAR UN PRODUCTO
routerCarrito.delete('/delete-product/:cid/:pid', controladorCarrito.removeProductFromCart);

export default routerCarrito