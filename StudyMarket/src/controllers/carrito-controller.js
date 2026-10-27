import modelCarrito from "../models/carrito-models.js";
import productosModels from "../models/productos-models.js";

//! GET ALL
const getAll = async (req, res) => {
  try {
    const carritos = await modelCarrito.obtenerTodosLosCarritos();
    return res.status(200).json(carritos);
  } catch (errorDelServidor) {
    // Clean Code: Protego la app de caídas si falla la DB
    return res.status(500).json({ mensaje: "Error interno al obtener la lista de carritos" });
  }
};

//! GET ONE
const getOne = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const carrito = await modelCarrito.obtenerCarritoPorId(id);

    // Clean Code: Cláusula de guarda (Guard Clause) para salir rápido si no existe
    if (!carrito) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
    
    return res.status(200).json(carrito);
  } catch (errorDelServidor) {
    return res.status(500).json({ mensaje: "Error interno al buscar el carrito" });
  }
};

//! AÑADIR PRODUCTO AL CARRITO
const addProductToCartController = async (req, res) => {
    try {
       const { pid, cantidad, cid } = req.body;
       
       if (!pid || !cantidad) {
        return res.status(400).json({ mensaje: 'El ID del producto y la cantidad son requeridos' });
       }
       
       const carritoActualizado = await modelCarrito.addProductToCart(cid, pid, cantidad);
       return res.status(200).json(carritoActualizado);
       
    } catch (errorDelServidor) {
        // Clean Code: Se eliminó el console.log comentado que ensuciaba el código
        return res.status(500).json({ mensaje: "Error al agregar el producto al carrito" });
    }
}

//! ELIMINAR PRODUCTO DEL CARRITO
const removeProductFromCart = async (req, res) => { 
    try {
        const { cid, pid } = req.params;

        if (!pid || !cid) {
            return res.status(400).json({ mensaje: 'El ID del producto y del carrito son requeridos' });
        }

        const carritoActualizado = await modelCarrito.removeProductFromCart(cid, pid);
        return res.status(200).json(carritoActualizado);

    } catch (errorDelServidor) {
        // Clean Code: Se elimina el console.log en producción
        return res.status(500).json({ mensaje: 'Error al eliminar el producto del carrito' });
    }
};

export default {
    getAll,
    getOne,
    addProductToCartController,
    removeProductFromCart
}