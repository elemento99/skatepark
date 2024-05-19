import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.route.js';
import path from 'path';
import { verifyTokenJWT } from "./middlewares/jwt.middleware.js";
import axios from 'axios';



export const app = express();

// Obligatorio tener node.js versión mínimo 20.11.0

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


//handlebars
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './views'));

app.get('/', (req, res) => {
    res.render('home', { title: "Skatepark22" });
});


app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')

})
//incorpor verifyTokenJWT
app.get('/datos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id) // Obtener el ID del usuario desde la URL
        // Llamar a la API para obtener los datos del usuario por ID
        const response = await axios.get(`http://localhost:3001/users/${id}`);
        const userData = response.data; // Obtener los datos del usuario desde la respuesta
        // res.render('datos')
        // Renderizar la página de datos con los datos del usuario
        res.render('datos', { user: userData.user });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Configuración de las rutas

app.use('/users', userRouter)

app.use('*', (_, res) => {
    res.status(404).json({ ok: false, msg: 'ruta no configurada 😐' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})