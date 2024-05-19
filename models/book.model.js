import { pool } from '../database/connection.database.js'
import format from 'pg-format'

const count = async () => {
    const { rows } = await pool.query('SELECT COUNT(*) FROM books')
    return rows[0].count
}

const findAll = async ({
    limit = 10,
    orderby = 'id',
    sort = 'asc',
    page = 1
}) => {

    const offset = (+page - 1) * limit

    const query = {
        text: `
        SELECT * FROM books
        ORDER BY %s %s
        LIMIT %s
        OFFSET %s
        `,
        values: [orderby, sort, limit, offset]
    }
    const formatQuery = format(query.text, ...query.values)
    const { rows } = await pool.query(formatQuery)
    return rows
}

const findOneById = async (id) => {
    const query = {
        text: `SELECT * FROM books WHERE id = $1`,
        values: [id]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

const create = async (newBook) => {
    const query = {
        text: `
        INSERT INTO books (NAME, AUTHOR, PRICE) 
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        values: [newBook.name, newBook.author, newBook.price]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

const update = async (book) => {
    const query = {
        text: `
        UPDATE books
        SET
        name = $1,
        price = $2,
        author = $3
        WHERE id = $4
        RETURNING *`,
        values: [book.name, book.price, book.author, book.id]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

const remove = async (id) => {
    const query = {
        text: `
        DELETE FROM books
        WHERE id = $1
        RETURNING *`,
        values: [id]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

export const BookModel = {
    count,
    findAll,
    findOneById,
    create,
    update,
    remove
}