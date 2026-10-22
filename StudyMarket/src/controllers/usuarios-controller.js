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
const createUser = async (req, res) => {
  const usuario = req.body;
 // console.log('[createUser]', usuario);
  

  const { name, email, password, confirm_password } = usuario;
  const errores = [];
  try {
    // Validadores
    if (!name || !email || !password || !confirm_password) {
      errores.push({ mensaje: "Todos los campos son obligatorios" });
    }

    if (!name || name.trim().length < 2) {
      errores.push({ mensaje: "El nombre debe tener al menos 2 caracteres" });
    }

    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!nameRegex.test(name)) {
      errores.push({
        mensaje: "El nombre solo puede contener letras y espacios",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errores.push({ mensaje: "El correo electrónico no es válido" });
    }
 
    if (password !== confirm_password) {
      errores.push({ mensaje: "Las contraseñas no coinciden" });
    } 
    //! Validaciones de contraseña para usar en la version final
    /* const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      errores.push({
        mensaje:
          "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial",
      });
    } */

    /* const weakPasswords = ["123456", "password", "qwerty", "admin"];

    if (weakPasswords.includes(password)) {
      errores.push({
        mensaje: "La contraseña es demasiado común, elige una más segura",
      });
    } */
    /* if (password.length > 30) {
      errores.push({
        mensaje: "La contraseña no puede tener más de 30 caracteres",
      });
    } */
    const usuarioEncontrado = await modelUsuarios.obtenerUsuarioPorEmail(email);

    if (usuarioEncontrado) {
      errores.push({ mensaje: "Ya existe un usuario con este correo" });
    }

    if (errores.length > 0) {
      return res.status(400).json(errores);
    }

    // Crear usuarios
    
    const usuarioCreado = await modelUsuarios.crearUsuario(usuario);
    //console.log('[createUser]', usuarioCreado);

    //Crear carrito
    const carritoCreado = await modelCarrito.crearCarrito({  usuario: usuarioCreado._id })
    usuarioCreado.carrito = carritoCreado._id
    await usuarioCreado.save()

    const objRespuesta = {
      name: usuarioCreado.name,
      email: usuarioCreado.email,
      id: usuarioCreado._id,
    };

    res.json(objRespuesta);
  } catch (error) {
    console.log(error);

    res.status(500).json({ mensaje: "No se pudo registrar el usuario" });
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
const editUsuatio = (req, res) => {
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
const enviarMailRecuperacion = async (req, res) => {
  try {
    const {email} = req.body
    const usuario = await modelUsuarios.obtenerUsuarioPorEmail(email)
    //console.log('[enviarMailRecuperacion] usuario:', usuario);
    
    if(!usuario) {
      console.log('[enviarMailRecuperacion] error:', error);
      throw error
    }

    const token = crypto.randomBytes(20).toString('hex')
    usuario.resetPasswordToken = token
    usuario.resetPasswordExpires = Date.now() + 1000 * 60 * 60
    await usuario.save()

    const mailOptions = {
      to: usuario.email,
      from: process.env.EMAIL_USER,
      subject: 'Recuperacion de contraseña',
      text: `Por favor, haz click en el siguiente enlace para recuperar tu contraseña \n\n http://localhost:8080/reset/${token} \n\n`
    }
    await transporter.sendMail(mailOptions)
    res.status(200).json({mensaje: 'Email enviado'})
  } catch (error) {
    console.log('[enviarMailRecuperacion]', error);
    throw error
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
  editUsuatio,
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
