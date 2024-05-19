import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router()

router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.put('/:id', UserController.actualizarUsuario)
router.delete('/:id', UserController.eliminarUsuario)

export default router;