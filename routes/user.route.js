import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyTokenJWT } from "../middlewares/jwt.middleware.js";


const router = Router()

router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.put('/:id', verifyTokenJWT, UserController.actualizarUsuario)
router.delete('/:id', UserController.eliminarUsuario)
router.get('/all', UserController.getAll)
router.put('/state/admin', UserController.changeState)

export default router;