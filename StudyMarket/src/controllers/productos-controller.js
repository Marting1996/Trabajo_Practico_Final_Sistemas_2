import modelProductos from "../models/productos-models.js";

//!GET ALL
const getAll = async (req, res) => {
  try {
    const productos = await modelProductos.obtenerTodosLosProductos()
    res.json(productos)
  } catch (error) {
   // console.log("[getAll]", error);

    res.status(404).json({ mensaje: "No se encontraron los productos" });
  }
};

//!GET ONE
const getOne = async (req, res) => {
  
  try {
    const pid  = req.params.id
    //console.log('[getOne pid]', pid);
    const unProducto = await modelProductos.obtenerProductosPorId(pid);
    //console.log("[getOne] producto:", unProducto);
    
  
    if (unProducto) {
      res.json(unProducto);
    } else {
      res.status(404).json({ mensaje: "Producto no disponible" });
    }
  } catch (error) {
    console.log("[getOne]", error);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

//!CREATE
const createProduct = async (req, res) => {
  const producto = req.body;
  const { nombre, descripcion, precio, imagen, categoria } = producto;
  const errores = [];
  console.log(producto);
  
  try {
    //Validadores
    if (!nombre || !precio || !descripcion || !imagen || !categoria) {
      errores.push({ mensaje: "Los campos Nombre y Precio son obligatorios" });
    }

    if (errores.length > 0) {
      return res.status(400).json(errores);
    }

    //Crear producto
    const productoCreado = await modelProductos.crearProducto(producto);
    console.log("Producto creado con exito:", productoCreado);
    
    res.json(productoCreado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "No se pudo crear el producto" });
  }
};

//!EDIT
const editProducto = async (req, res) => {
  const pid = req.params.id; 
  const productoPorEditar = req.body;
  /* const id = Number(req.params.id);
  const productoPorEditar = req.body; */
  try { 
    const productoActualizado = await modelProductos.actualizarProducto(pid, productoPorEditar); 
    if (!productoActualizado) { 
      res.status(404).json({ mensaje: "No se encontró el producto solicitado para editar" }); 
    } else { 
      res.json(productoActualizado); 
    } 
    } catch (error) {
       res.status(500).json({ mensaje: "No se pudo editar el producto" 
       }); 
      }
};

//!REMOVE
const removeProducto = async (req, res) => {
  const pid = req.params.id;
  console.log(pid);
  
  try { 
    const productoEliminado = await modelProductos.eliminarProducto(pid); 
    console.log('[removeProducto]', productoEliminado);
    
    if (!productoEliminado) { 
      res.status(404).json({ mensaje: "No se encontró el producto para eliminarlo" }); 
    } else { res.json({ mensaje: "Producto eliminado con éxito" }); 
    } } catch (error) 
    { res.status(500).json({ mensaje: "No se pudo eliminar el producto" }); 
  }
};

export default {
  getAll,
  getOne,
  createProduct,
  editProducto,
  removeProducto,
};
