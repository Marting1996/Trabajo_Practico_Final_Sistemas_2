import passport from "passport";
import * as passportStrategyJwt from "../utils/handle-jwt.js";

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

export default autorizado;