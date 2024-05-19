import { handleErrorDatabase } from "../database/errors.database.js"
import { BookModel } from "../models/book.model.js"

// http://localhost:3000/api/v1/books
// http://localhost:3000/api/v1/books?limit=5
// http://localhost:3000/api/v1/books?limit=5&orderby=price&sort=desc
// http://localhost:3000/api/v1/books?limit=5&orderby=price&sort=desc&page=1
const getBooks = async (req, res) => {

    console.log({ email: req.email })

    const {
        limit = 10,
        orderby = 'id',
        sort = 'asc',
        page = 1
    } = req.query

    if (+page < 1 || +limit < 1 || +limit > 100) {
        return res.status(400).json({ ok: false, msg: "page o limit no puede ser menor a 1" })
    }

    try {
        const books = await BookModel.findAll({ limit: +limit, orderby, sort, page: +page })
        const count = await BookModel.count()

        const baseUrl = `http://localhost:3000/api/v1/books?limit=${limit}&orderby=${orderby}&sort=${sort}`

        const totalPages = Math.ceil(+count / +limit)

        return res.json({
            limit: +limit,
            count: +count,
            currentPage: +page,
            totalPages,
            next: (+page >= totalPages) ? null : `${baseUrl}&page=${+page + 1}`,
            previous: (+page - 1) < 1 ? null : `${baseUrl}&page=${+page - 1}`,
            books: books
        })
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}

const getBookById = async (req, res) => {
    try {
        const { id } = req.params
        const book = await BookModel.findOneById(id)
        return res.json(book)
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}

const createBook = async (req, res) => {
    try {
        const { name, author, price } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({
                ok: false,
                msg: "Name obligatorio"
            })
        }

        if (!price || price < 0) {
            return res.status(400).json({
                ok: false,
                msg: "Price obligatorio"
            })
        }

        if (!author || !author.trim()) {
            return res.status(400).json({
                ok: false,
                msg: "Author obligatorio"
            })
        }

        const book = await BookModel.create({ name, author, price })
        return res.status(201).json(book)
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}

const updateBook = async (req, res) => {
    try {
        const { name, author, price } = req.body
        const { id } = req.params
        const book = {
            id, name, author, price
        }
        const updateLibro = await BookModel.update(book)
        return res.json(updateLibro)
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}

const removeBook = async (req, res) => {
    try {
        const { id } = req.params
        const book = await BookModel.remove(id)
        return res.json(book)
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}

export const BookController = {
    getBooks,
    createBook,
    getBookById,
    updateBook,
    removeBook
}