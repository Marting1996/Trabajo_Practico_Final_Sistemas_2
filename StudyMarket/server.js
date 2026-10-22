import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from 'passport'
import "dotenv/config";
import methodOverride from "method-override";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import cors from 'cors'

import routerProductos from "./src/routers/productos-router.js";
import routerUsuarios from "./src/routers/user-router.js";
import routerCarrito from "./src/routers/carrito-router.js";
import handleConnection from "./src/utils/handle-connection.js";
import * as passportStrategy from "./src/utils/handle-passport.js"
import * as passportStrategyJwt from "./src/utils/handle-jwt.js"

//! Constantes
const app = express();
const PORT = process.env.PORT || 8888;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_LOCAL = process.env.MONGO_LOCAL;
const MONGO_REMOTO = process.env.MONGO_REMOTO;
const SECRET_SESSION = process.env.SECRET;

//! Handlebars
app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs"
  })
)

app.set("view engine", "hbs")
app.set("views", "./views")

//! CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}
//! Middlewares
app.use(express.static("./public"));
//app.use(express.static("./views"));
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(methodOverride('_method'))
app.use(cookieParser())

// ! Configuracion express-sessions
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_REMOTO }),
  }),
);

//! Configurando Passport
app.use(passport.initialize())
app.use(passport.session())


//! Rutas
//?PRODUCTOS
app.use("/api/productos", routerProductos);

//?USUARIOS
app.use("/api/usuarios", routerUsuarios);

//?CARRITO
app.use("/api/carritos", routerCarrito)

//! Arranque del servidor

app.listen(PORT, (err) => {
  if (err) throw new Error(`No se pudo levantar el servidor ${err}`);
  console.log(`La aplicaión arrancó -> http://localhost:${PORT}`);
  if (NODE_ENV === "desarrollo") {
    handleConnection(MONGO_REMOTO);
  } else {
    handleConnection(MONGO_LOCAL);
  }
});
