import { UserModel } from '../models/user.model.js'
import { handleErrorDatabase } from '../database/errors.database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOneByEmail(email)

        if (!user) return res.status(400).json({
            ok: false,
            msg: "El email no está registrado"
        })

        const passwordIsValid = await bcrypt.compare(password, user.password)
        if (!passwordIsValid) return res.status(401).json({
            ok: false,
            msg: "Contraseña incorrecta"
        })

        const token = jwt.sign(
            { email: user.email },
            process.env.SECRET_JWT,
            { expiresIn: '1h' }
        )

        return res.json({
            token,
            email: user.email
        })
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}


const idEmail = async (req, res) => {
    try {
        const { email} = req.body
        const user = await UserModel.findOneByEmail(email)

        if (!user) return res.status(400).json({
            ok: false,
            msg: "El email no está registrado"
        })

        return res.json({
            id: user.id
        })
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}

const usuarioId = async (req, res) => {
    try {
        const { id} = req.params
        const user = await UserModel.findOneById(id)

        if (!user) return res.status(400).json({
            ok: false,
            msg: "El email no está registrado"
        })

        return res.json({
            user
        })
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}


const register = async (req, res) => {
    try {
        const { email, nombre, password, anos_experiencia, especialidad, foto,estado } = req.body

        const newUser = await UserModel.findOneByEmail(email)
        if (newUser) return res.status(400).json({
            ok: false,
            msg: "el email ya está registrado"
        })

        // hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const user = await UserModel.create({ email, nombre, password: hashPassword, anos_experiencia, especialidad, foto,estado })

        const token = jwt.sign(
            { email: user.email },
            process.env.SECRET_JWT,
            { expiresIn: '1h' }
        )

        return res.json({
            token,
            email: user.email
        })
    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}

const actualizarUsuario = async (req, res ) => {
    try {
            const { nombre, password, anos_experiencia, especialidad} = req.body
            const {id}= req.params
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt)
            const actualizarUsuarios = { nombre, password: hashPassword, anos_experiencia, especialidad, id}
            const usuarioActualizado = await UserModel.actualizar(actualizarUsuarios)
    
            if (!usuarioActualizado) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(usuarioActualizado)
    
        }catch (error){
            return res.status(500).json( {ok: true})
    
    }
    }

    const eliminarUsuario = async (req, res) => {
        try{
            const { id } = req.params
            const usuarioEliminado = await UserModel.eliminar(id)
            return res.json(usuarioEliminado)
    
        }catch (error) {
            return res.status(500).json( {ok: false})
    
        }
    
    }

export const UserController = {
    actualizarUsuario,
    login,
    register,
    eliminarUsuario,
    idEmail,
    usuarioId
}