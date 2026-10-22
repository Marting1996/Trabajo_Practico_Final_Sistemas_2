import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuariosEsquema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    carrito: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carrito"
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usuariosEsquema.methods.encriptarPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};

usuariosEsquema.methods.comprobarPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default usuariosEsquema;
