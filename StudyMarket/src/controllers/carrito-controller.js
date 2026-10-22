import modelCarrito from "../models/carrito-models.js";
import productosModels from "../models/productos-models.js";

//! GET ALL
const getAll = async (req, res) => {
  const carritos = await modelCarrito.obtenerTodosLosCarritos();
  res.json(carritos);
};

//! GET ONE
const getOne = async (req, res) => {
  const id = Number(req.params.id);
  const carrito = await modelCarrito.obtenerCarritoPorId(id);

  if (carrito) {
    res.json(carrito);
  } else {
    res.status(404).json({ mensaje: "Carrito no encontrado" });
  }
};

//! AÑADIR PRODUCTO AL CARRITO

const addProductToCartController = async (req, res) => {
    try {
       const {pid, cantidad, cid} = req.body
       if (!pid || !cantidad) {
        return res.status(400).json({mensaje: 'Producto y cantidad son requeridos'})
       }
       const carritoActualizado = await modelCarrito.addProductToCart(cid, pid, cantidad)

       return res.json(carritoActualizado)
    } catch (error) {
        //console.log('[addProductToCartController]', error);
        return res.status(500).json({mensaje: "Error al agregar producto al carrito"})
    }
}

//! ELIMINAR PRODUCTO DEL CARRITO

const removeProductFromCart = async (req, res) => { 
    try {
        const { cid, pid } = req.params;

        // Validación
        if (!pid || !cid) {
            return res.status(400).json({ mensaje: 'Producto y carrito son requeridos' });
        }

        // Llama al modelo para eliminar el producto del carrito
        const carritoActualizado = await modelCarrito.removeProductFromCart(cid, pid);

        // Retorna el carrito actualizado
        return res.json(carritoActualizado);

    } catch (error) {
        console.log('[removeProductFromCartController]', error);
        return res.status(500).json({ mensaje: 'Error al eliminar producto del carrito' });
    }
};

export default {
    getAll,
    getOne,
    addProductToCartController,
    removeProductFromCart
}