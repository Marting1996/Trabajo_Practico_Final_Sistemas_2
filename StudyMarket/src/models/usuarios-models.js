import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import usuariosEsquema from "./schemas/usuarios.schemas.js";

const UsuarioModelo = mongoose.model("usuarios", usuariosEsquema);

const obtenerTodosLosUsuarios = async () => {
  try {
    const usuarios = await UsuarioModelo.find()
    return usuarios
  } catch (error) {
    throw error
  }

};

const obtenerUsuarioPorId = async (id) => {
  
  try {
    const usuario = await UsuarioModelo.findById(id)
    return usuario
  } catch (error) {
    console.log("[obtenerUsuarioPorId]", error);
    
  }
  
};
const obtenerUsuarioPorEmail = async (email) => {
  try {
    const usuarioEncontrado = await UsuarioModelo.findOne({ email: email });
    //console.log("[usuarioEncontradoPorEmail]", usuarioEncontrado);
    
    return usuarioEncontrado;
  } catch (error) {
    throw error;
  }
};

const obtenerUsuarioPorToken = async (token) => {
  try {
    //console.log('[obtenerUsuarioPorToken] Token', token);
    const usuario = await UsuarioModelo.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {$gt: Date.now()}
    })
    //console.log('[obtenerUsuarioPorToken] Usuario', usuario);
    return usuario
  } catch (error) {
    console.log('[obtenerUsuarioPorToken]', error);
    throw error
  }
}

const obteneterLaPosicionDelUsuario = (id) => {
  const usuario = usuarios.find((user) => user.id === id);

  return usuario;
};

const crearUsuario = async (usuario) => {
 // console.log('[CrearUsuario:]', usuario);
  try {
    const usuarioCreado = new UsuarioModelo(usuario);
    console.log('[CrearUsuario:]', usuarioCreado);
    usuarioCreado.password = await usuarioCreado.encriptarPassword(
      usuario.password,
    );
    //console.log('[CrearUsuario:]', usuarioCreado);
    
    await usuarioCreado.save();
    return usuarioCreado;
  } catch (error) {
    throw error;
  }
};

const revisarPassword = async (usuario, password) => {
  try {
    const isMatch = await usuario.comprobarPassword(password)
    return isMatch
  } catch (error) {
    throw error
  }
}

const actualizarUsuario = (index, id, usuarioPorEditar) => {
  usuarioPorEditar.id = id;
  usuarios.splice(index, 1, usuarioPorEditar);
  return usuarioPorEditar;
};

const eliminarUsuario = (index) => {
  const arrayUsuariosEliminados = usuarios.splice(index, 1);
  const usuarioEliminado = arrayUsuariosEliminados[0];
  return usuarioEliminado;
};
const encriptarPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
}

const restablecerContraseña = async (token, nuevaContraseña) => {
  try {
    const usuario = await obtenerUsuarioPorToken(token)
    if(!usuario) {
      console.log('[restablecerContraseña] El token es invalido o expiro', error);
      throw error
    }
    console.log('[restablecerContraseña] Contraseña antes del hash', usuario.password);
    
    usuario.password = await encriptarPassword(nuevaContraseña)
    console.log('[restablecerContraseña] Contraseña despues del hash', usuario.password);
    usuario.resetPasswordToken = undefined
    usuario.resetPasswordExpires = undefined
    await usuario.save()
    return usuario
  } catch (error) {
    console.log('[restablecerContrasena] Error:', error);
    throw error
  }
}

export default {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  obteneterLaPosicionDelUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  revisarPassword,
  obtenerUsuarioPorToken,
  restablecerContraseña
};
