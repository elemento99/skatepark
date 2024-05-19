
const registerForm = document.querySelector('#registro')
const loginForm = document.querySelector('login')

// loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault
// })

registerForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault()
        const email = e.target.email.value
        const nombre = e.target.nombre.value
        const password = e.target.password.value
        const password2 = e.target.password2.value
        const anos_experiencia = e.target.anos_experiencia.value
        const especialidad = e.target.especialidad.value
        const foto = "foto"
        const estado = true

        // const formData = new FormData()
        // formData.append('email', email)
        // formData.append('nombre', nombre)
        // formData.append('password', password)
        // //formData.append('password2', password2)  // Agregar password2 si es necesario en backend
        // formData.append('anos_experiencia', anos_experiencia)
        // formData.append('especialidad', especialidad)
        // formData.append('foto', foto)
        // formData.append('estado', estado)

    
        const response = await axios.post('/users/register', { 
            email, 
            nombre, 
            password, 
            anos_experiencia, 
            especialidad, 
            foto, 
            estado 
        })
        console.log(response)

        // Descomentar estas líneas si todo funciona correctamente
        // localStorage.setItem('token', response.data.token)
        // alert('Usuario creado... redirigiendo al dashboard')
        // window.location.href = "/"
    } catch (error) {
        console.error(error)
        if (error.response && error.response.data && error.response.data.msg) {
            alert(error.response.data.msg)
        } else {
            alert('Ocurrió un error al procesar la solicitud.')
        }
    }
})