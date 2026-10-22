import mongoose from "mongoose";

const productosEsquema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
    },
    descripcion: {
      type: String,
    },
    imagen: {
      type: String,
    },
    categoria: {
      type: String,
    },
    precio: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default productosEsquema
