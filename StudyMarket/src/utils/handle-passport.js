import { Strategy } from "passport-local";
import passport  from "passport";
import usuariosModels from "../models/usuarios-models.js";

const fieldEstrategia = { usernameField: 'email'}

const comprobacionUsuario = async (email, password, done) => {
    try {
        const usuario = await usuariosModels.obtenerUsuarioPorEmail(email)
        console.log("[comprobacionUsuario]", usuario);
        

        if(!usuario) {
            return done(null, false, {mensaje: "El usuario no existe"})
        }
        
        const passwordCorrecto = await usuariosModels.revisarPassword(usuario, password)

        if(!passwordCorrecto) {
            return done(null, false, {mensaje: "La contraseña es incorrecta"})
        }

        return done(null, usuario)
    } catch (error) {
        return done(error)
    }
}

const estrategiaLocal = new Strategy(fieldEstrategia, comprobacionUsuario)

passport.serializeUser((usuario, done) => { 
    done(null,usuario.id)
})

passport.deserializeUser(async (id, done) => {
    const usuario = await usuariosModels.obtenerUsuarioPorId(id)
    done(null, usuario)
})

export default passport.use(estrategiaLocal)