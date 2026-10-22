import express from 'express'
import controladorUsuarios from '../controllers/usuarios-controller.js'

const routerUsuarios = express.Router()

//!READ ALL
routerUsuarios.get('/getall', controladorUsuarios.getAll)

//!REGISTER
routerUsuarios.get('/register', controladorUsuarios.formularioRegistro)
routerUsuarios.post('/register', controladorUsuarios.createUser)

//!LOGIN
routerUsuarios.get("/login", controladorUsuarios.formularioLogeo)
routerUsuarios.post("/login", controladorUsuarios.login)

//!PERFIL
routerUsuarios.get("/perfil", controladorUsuarios.autorizado, controladorUsuarios.perfil)

//!READ ONE BY EMAIL
routerUsuarios.get('/email/:email', controladorUsuarios.getUserByEmail) 

//!READ ONE BY ID
routerUsuarios.get('/getone/:id', controladorUsuarios.getUserById)

//!UPDATE
routerUsuarios.put('/update/:id', controladorUsuarios.editUsuatio)

//!DELETE
routerUsuarios.delete('/delete/:id', controladorUsuarios.eliminarUsuario)

//!RESET PASS
routerUsuarios.post('/forgot', controladorUsuarios.enviarMailRecuperacion)
routerUsuarios.post('/reset/:token', controladorUsuarios.resetPassword)
//!OTRAS
routerUsuarios.all('*', (req, res) => {
    res.status(404).json({ mensaje: "Recurso no encontrado" })
})


export default routerUsuarios
