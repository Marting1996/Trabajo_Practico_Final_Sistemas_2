import passport from "passport";
import usuariosModels from "../models/usuarios-models.js";
import JwtStrategy from "passport-jwt/lib/strategy.js"
import { ExtractJwt } from "passport-jwt";

const opts = {};

const extraerCookie = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  console.log("token:", token);
  
  return token;
};

opts.jwtFromRequest = extraerCookie
opts.secretOrKey = process.env.JWT;

const comprobacionUsuario = async (jwt_payload, done) => {
  try {
    const usuario = await usuariosModels.obtenerUsuarioPorId(jwt_payload.id); 
    console.log("usuario en [comprobacionUsuario]", usuario);
    
    if (usuario) {
      return done(null, usuario, { mensaje: "Se encontro el usuario" });
    } else {
      return done(null, false, { mensaje: "No se encontro el usuario" });
    }
  } catch (error) {
    console.log("[comprobacionUsuario]", error);
    return done(error, false);
  }
};

const estrategiaJwt = new JwtStrategy(opts, comprobacionUsuario)

export default passport.use(estrategiaJwt)
