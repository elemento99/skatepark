import { Router } from "express";
import { BookController } from "../controllers/book.controller.js";
import { verifyTokenJWT } from "../middlewares/jwt.middleware.js";

const router = Router()

// router.use(verifyTokenJWT)

// PATH: /api/v1/books

router.get('/', BookController.getBooks)
router.get('/:id', BookController.getBookById)
router.post('/', verifyTokenJWT, BookController.createBook)
router.put('/:id', verifyTokenJWT, BookController.updateBook)
router.delete('/:id', verifyTokenJWT, BookController.removeBook)

export default router;