import { pool } from '../database/connection.database.js'

const findOneByEmail = async (email) => {
    const query = {
        text: `
            SELECT * FROM skaters
            WHERE EMAIL = $1
        `,
        values: [email]
    }
    const { rows } = await pool.query(query)
    return rows[0]}

    const findOneById = async (id) => {
        const query = {
            text: `
                SELECT * FROM skaters
                WHERE id = $1
            `,
            values: [id]
        }
        const { rows } = await pool.query(query)
        return rows[0]}


const create = async ({ email, nombre, password, anos_experiencia, especialidad, foto, estado }) => {
    const query = {
        text: `
            INSERT INTO skaters (EMAIL,NOMBRE, PASSWORD, ANOS_EXPERIENCIA, ESPECIALIDAD, FOTO, estado)
            VALUES ($1, $2, $3,$4,$5,$6,$7)
            RETURNING *
        `,
        values: [ email, nombre, password, anos_experiencia, especialidad, foto,estado]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

const actualizar = async (usuarios) => {
    try {
        const query = {
            text: "UPDATE skaters SET NOMBRE = $1, PASSWORD = $2, ANOS_EXPERIENCIA=$3, ESPECIALIDAD=$4 WHERE ID = $5 RETURNING *",
            values: [usuarios.nombre, usuarios.password, usuarios.anos_experiencia, usuarios.especialidad, usuarios.id]
        };
        
        const { rows } = await pool.query(query);
        return rows[0];
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error; 
    }
}

const changeState = async(email, state)=>{
    const query = {
        text: `UPDATE skaters SET estado = $2 WHERE email = $1 RETURNING *;`,
        values: [email, state]
    }

    const { rows } = await pool.query(query);
    return rows[0]; 
}


const eliminar = async (id) => {

    const query = {
        text: "DELETE FROM skaters WHERE ID =$1 RETURNING *",
        values: [id]
    }
    const { rows } = await pool.query(query)
    return rows

}

const all = async()=>{
    const query = {
        text: `SELECT * FROM skaters ORDER BY id;`,
        values: []
    }

    const { rows } = await pool.query(query);
    return rows;
}



export const UserModel = {
    actualizar,
    findOneByEmail,
    findOneById,
    create,
    eliminar,
    all,
    changeState
}