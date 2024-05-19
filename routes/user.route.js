import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router()

router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.put('/:id', UserController.actualizarUsuario)
router.delete('/:id', UserController.eliminarUsuario)
router.post('/idEmail', UserController.idEmail)
router.get('/:id', UserController.usuarioId)

export default router;