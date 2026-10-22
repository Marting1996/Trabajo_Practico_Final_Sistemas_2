import mongoose from "mongoose";
import productosEsquema from "./schemas/productos.schemas.js";

const ProductoModelo = mongoose.model("productos", productosEsquema)

const obtenerTodosLosProductos = async () => {
   try {
      const productos = await ProductoModelo.find()
      //console.log(productos);
      
      return productos
   } catch (error) {
      console.log("[obtenerTodosLosProductos]", error);
      
   }
};

const obtenerProductosPorId = async (pid) => {
   //console.log("[obtenerProductosPorId] pid:", pid); 
   try {
     const producto = await ProductoModelo.findById(pid);
    // console.log("[obtenerProductosPorId] producto:", producto);
     
     return producto;
   } catch (error) {
     console.log("[obtenerProductosPorId]", error);
     throw error;
   }
 };

const obtenerLaPosicionDelProducto = (pid) => {
   try {
      const producto = producto.find((prod) => prod.pid === pid)
      return producto
   } catch (error) {
      console.log("[obtenerProductosPorId]", error);
   }
};

const crearProducto =  async (producto) => {
   try {
      const productoCreado = new ProductoModelo(producto)
      await productoCreado.save()
      //console.log('[crearProducto]', productoCreado);
      
      return productoCreado
   } catch (error) {
      throw error
   }
};

const actualizarProducto = async (index, pid, productoPorEditar) => {
   try { 
      const productoActualizado = await ProductoModelo.findByIdAndUpdate(pid, productoPorEditar, { new: true }); 
      return productoActualizado; 
   } catch (error) { 
      throw error; 
   }
};

const eliminarProducto = async (pid) => {
   console.log('Eliminando producto...', pid);
   
   try { 
      const productoEliminado = await ProductoModelo.findByIdAndDelete(pid); 
      //console.log(productoEliminado);
      if(!productoEliminado) {
         throw new Error("Producto no encontrado");
      }
      return productoEliminado; 
   } catch (error) { 
      throw error; 
   }
}; 

export default {
   obtenerTodosLosProductos,
   obtenerProductosPorId,
   obtenerLaPosicionDelProducto,
   crearProducto,
   actualizarProducto,
   eliminarProducto,
};
