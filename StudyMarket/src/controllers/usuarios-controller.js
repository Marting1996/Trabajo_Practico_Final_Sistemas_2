import passport from "passport";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import modelUsuarios from "../models/usuarios-models.js";
import modelCarrito from "../models/carrito-models.js"
import transporter from "../config/email.js";
import "dotenv/config";
import * as passportStrategyJwt from "../utils/handle-jwt.js";

const formularioRegistro = (req, res) => {
  res.render("usuarios/register");
};

//!GET ALL
const getAll = async (req, res) => {
  try {
    const usuarios = await modelUsuarios.obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.log(error);

    res.status(404).json({ mensaje: "No se encontraron los usuarios" });
  }
};

//!GET ONE BY ID
const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const unUsuario = await modelUsuarios.obtenerUsuarioPorId(id);
    if (unUsuario) {
      res.json(unUsuario);
    } else {
      res.status(404).json({ mensaje: "No se encontro el usuario por id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//!GET ONE BY EMAIL
const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const unUsuario = await modelUsuarios.obtenerUsuarioPorEmail(email);
    if (unUsuario) {
      res.json(unUsuario);
    } else {
      res.status(404).json({ mensaje: "No se encontro el usuario por email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//!REGISTER
// Clean Code & SRP: separo la responsabilidad de validación en su propia función
const validarDatosRegistro = (name, email, password, confirm_password) => {
  const errores = [];
  if (!name || !email || !password || !confirm_password) {
    errores.push({ mensaje: "Todos los campos son obligatorios" });
  }
  if (name && name.trim().length < 2) {
    errores.push({ mensaje: "El nombre debe tener al menos 2 caracteres" });
  }
  if (name && !/^[a-zA-Z\s]+$/.test(name)) {
    errores.push({ mensaje: "El nombre solo puede contener letras y espacios" });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errores.push({ mensaje: "El correo electrónico no es válido" });
  }
  if (password !== confirm_password) {
    errores.push({ mensaje: "Las contraseñas no coinciden" });
  }
  return errores;
};

//!REGISTER - Controlador con Responsabilidad Única (SRP)
const createUser = async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    
    // 1. delego la validación
    const erroresDeValidacion = validarDatosRegistro(name, email, password, confirm_password);
    if (erroresDeValidacion.length > 0) {
      return res.status(400).json(erroresDeValidacion);
    }

    // 2. verifico duplicados
    const usuarioExistente = await modelUsuarios.obtenerUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json([{ mensaje: "Ya existe un usuario con este correo" }]);
    }

    // 3. creo entidades
    const nuevoUsuario = await modelUsuarios.crearUsuario(req.body);
    const nuevoCarrito = await modelCarrito.crearCarrito({ usuario: nuevoUsuario._id });
    
    nuevoUsuario.carrito = nuevoCarrito._id;
    await nuevoUsuario.save();

    // 4. Formateo respuesta (Clean Code: variables descriptivas)
    const respuestaAlCliente = {
      id: nuevoUsuario._id,
      name: nuevoUsuario.name,
      email: nuevoUsuario.email,
    };

    return res.status(201).json(respuestaAlCliente);
  } catch (errorDelServidor) {
    console.error("[createUser] Error:", errorDelServidor);
    return res.status(500).json({ mensaje: "No se pudo registrar el usuario por un error interno" });
  }
};

//!LOG IN
const formularioLogeo = (req, res) => {
  res.render("usuarios/login");
};

//?LOGIN JWT
const login = async (req, res) => {
  passport.authenticate("local", { session: false }, (err, usuario, info) => {
    if (err || !usuario) {
      return res.status(400).json({ mensaje: "Error en el login", usuario: usuario})
    }

    req.login(usuario, {session: false}, (err) => {
      if(err) {
        res.send(err)
      }
      const token = jwt.sign({id: usuario._id}, process.env.JWT, {expiresIn: "1h"})

      res.cookie('jwt', token, {httpOnly: true, secure: true})
      return res.json({usuario, token})
    })
  })(req, res)
}
  
/* const login =
  (passport.authenticate("local"), (req, res) => {
    const payload = { id: req.user._id };
    const secret_jwt = process.env.JWT;
    const tiempo_duracion_token = { expiresIn: "1h" };
    const token = jwt.sign(payload, secret_jwt, tiempo_duracion_token);
    res.json({ token });
  }); */

//!PERFIL
const autorizado = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Error en la autenticación:", err);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }

    if (!user) {
      console.log("Información de autenticación:", info);
      return res.status(401).json({ mensaje: "No autorizado" });
    }

    req.user = user;  // Asegúrate de que el usuario se establece en req
    next();
  })(req, res, next);
};

const perfil = (req, res) => {
  const usuario = req.user;
  const usuarioPersonalizado = {
    nombre: usuario.name,
    email: usuario.email,
  };

  console.log("Usuario conectado:", usuarioPersonalizado);
  res.json({ usuario: usuarioPersonalizado });
};



//!EDIT
const editUsuario = (req, res) => {
  const id = Number(req.params.id);
  const usuarioPorEditar = req.body;

  const index = modelUsuarios.obteneterLaPosicionDelUsuario(id);

  if (index >= 0) {
    const usuarioActualizado = modelUsuarios.actualizarUsuario(
      index,
      id,
      usuarioPorEditar,
    );
    res.json(usuarioActualizado);
    console.log("Usuario actualizado correctamente");
  } else {
    res.status(404).json({ mensaje: " No se encontro el usuario" });
  }
};

//!REMOVE
const eliminarUsuario = (req, res) => {
  const id = Number(req.params.id);

  const index = modelUsuarios.obteneterLaPosicionDelUsuario(id);

  if (index >= 0) {
    const usuarioEliminado = modelUsuarios.eliminarUsuario(index);
    res.json(usuarioEliminado);
    console.log("Usuario eliminado correctamente");
  } else {
    res.status(404).json({ mensaje: "No se encontro el usuario" });
  }
};

//!RESET PASS
//!RESET PASS
const enviarMailRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;
    const usuarioEncontrado = await modelUsuarios.obtenerUsuarioPorEmail(email);
    
    // Clean Code: Validamos y respondemos ordenadamente si no existe, sin romper la app.
    if(!usuarioEncontrado) {
      return res.status(404).json({ mensaje: 'No se encontró un usuario con ese correo electrónico' });
    }

    const tokenRecuperacion = crypto.randomBytes(20).toString('hex');
    usuarioEncontrado.resetPasswordToken = tokenRecuperacion;
    // 3600000 ms = 1 hora (evitamos la multiplicación manual 'mágica' en línea)
    usuarioEncontrado.resetPasswordExpires = Date.now() + 3600000; 
    await usuarioEncontrado.save();

    const mailOptions = {
      to: usuarioEncontrado.email,
      from: process.env.EMAIL_USER,
      subject: 'Recuperación de contraseña',
      text: `Por favor, haz click en el siguiente enlace para recuperar tu contraseña: \n\n http://localhost:8080/reset/${tokenRecuperacion} \n\n`
    };
    
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ mensaje: 'Correo de recuperación enviado con éxito' });

  } catch (errorDelServidor) {
    // Manejo de error claro y estandarizado
    return res.status(500).json({ mensaje: 'Ocurrió un error interno al intentar enviar el correo', error: errorDelServidor.message });
  }
}

const resetPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  //console.log('[resetPassword] Token:', token);
  console.log('[resetPassword] password:', password);
  try {
    const usuario = await modelUsuarios.restablecerContraseña(token, password)
    console.log('[resetPassword] Usuario luego de cambiar la contraseña', usuario);
    
    res.status(200).json({mensaje: 'Contraseña restablecida con exito'})
  } catch (error) {
    res.status(500).json({mensaje: 'Error al reestablecer la contraseña'})
  }
}


export default {
  getAll,
  getUserByEmail,
  getUserById,
  createUser,
  editUsuario,
  eliminarUsuario,
  formularioRegistro,
  login,
  //logout,
  autorizado,
  perfil,
  formularioLogeo,
  enviarMailRecuperacion,
  resetPassword
};
