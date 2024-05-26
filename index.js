import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.route.js';
import path from 'path';
import fileUpload from 'express-fileupload';

export const app = express();

// Obligatorio tener node.js versión mínimo 20.11.0

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use( fileUpload())
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
app.get('/admin', (req, res) => {
    res.render('Admin', )})
app.get('/dashboard', (req, res) => {
    res.render('datos', )})
// Configuración de las rutas

app.use('/users', userRouter)

app.use('*', (_, res) => {
    res.status(404).json({ ok: false, msg: 'ruta no configurada 😐' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})