import { UserModel } from '../models/user.model.js'
import { handleErrorDatabase } from '../database/errors.database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path';

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
            email: user.email,
            id: user.id,
            nombre: user.nombre,
            anos_experiencia: user.anos_experiencia,
            especialidad: user.especialidad
        })


    } catch (error) {
        console.log(error)
        const { code, msg } = handleErrorDatabase(error)
        return res.status(code).json({ ok: false, msg })
    }
}
const __dirname = import.meta.dirname;

const register = async (req, res) => {
    try {
        const { email, name, password, anos_experiencia, especialidad } = req.body;
        const foto = req.files.foto;

        console.log({ email, name, password, anos_experiencia, especialidad, foto });

        const newUser = await UserModel.findOneByEmail(email);
        if (newUser) {
            return res.status(400).json({ ok: false, msg: 'El usuario ya existe!' });
        }

        let pictureFile = foto;
        let uploadPath = path.join(__dirname, '../public/imgs/', pictureFile.name);

        await new Promise((resolve, reject) => {
            pictureFile.mv(uploadPath, (err) => {
                if (err) {
                    reject({ code: 500, msg: err });
                } else {
                    resolve();
                }
            });
        });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await UserModel.create({
            email,
            nombre: name,
            password: hashPassword,
            anos_experiencia,
            especialidad,
            foto: pictureFile.name,
            estado: true
        });

       
        return res.status(200).json({ ok: true, msg: 'Usuario creado correctamente' });

    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json({ ok: false, msg: error.msg || 'Error del servidor' });
    }
};


const usuarioId = async (req, res) => {
    try {
        const { id } = req.params
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



const actualizarUsuario = async (req, res) => {
    try {
        const { nombre, password, anos_experiencia, especialidad } = req.body
        const { id } = req.params
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)
        const actualizarUsuarios = { nombre, password: hashPassword, anos_experiencia, especialidad, id }
        const usuarioActualizado = await UserModel.actualizar(actualizarUsuarios)

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(usuarioActualizado)

    } catch (error) {
        return res.status(500).json({ ok: true })

    }
}

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params
        const usuarioEliminado = await UserModel.eliminar(id)
        return res.json(usuarioEliminado)

    } catch (error) {
        return res.status(500).json({ ok: false })

    }

}


const getAll = async(req, res) =>{
    try {
        const users = await UserModel.all();
        return res.json({users});
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ok: false, msg: error.msg});   
    }
}


const changeState = async(req, res)=>{
    try {
        
        const { email, state} = req.body;

        const user = await UserModel.changeState(email, state);

        return res.json({ok: true, user});
    } catch (error) {
        console.error(error);
        return res.status(error.code.json({ok: false, msg: error.msg}));
    }
}

export const UserController = {
    actualizarUsuario,
    login,
    register,
    eliminarUsuario,
    usuarioId,
    getAll,
    changeState
}