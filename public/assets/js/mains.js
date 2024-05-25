document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#register');
    const loginForm = document.querySelector('#login');
    const actualizarForm = document.getElementById('#actualizar');

    // if (loginForm) {
    //   loginForm.addEventListener('submit', async (e) => {
    //     try {
    //       e.preventDefault();

    //       const email = e.target.email.value;
    //       const password = e.target.password.value;
    //       const { data } = await axios.post('/users/login', { email, password });
    //       localStorage.setItem('token', data.token);

    //       const { data: userData } = await axios.post('/users/idEmail', { email });
    //       const userId = userData.id;

    //       alert('Credenciales correctas... redirigiendo al dashboard');
    //       window.location.href = `/datos/${userId}`;
    //       console.log(data);
    //     } catch (error) {
    //       console.error(error);
    //       if (error.response && error.response.data && error.response.data.msg) {
    //         alert(error.response.data.msg);
    //       } else {
    //         alert('Ocurrió un error al procesar la solicitud.');
    //       }
    //     }
    //   });
    // }

    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        try {
          e.preventDefault();
          const email = e.target.email.value;
          const nombre = e.target.nombre.value;
          const password = e.target.password.value;
          const password2 = e.target.password2.value;
          const anos_experiencia = e.target.anos_experiencia.value;
          const especialidad = e.target.especialidad.value;
          const foto = "foto";
          const estado = true;
            
          if (password !== password2) {
            alert('Las contraseñas no coinciden');
            return;
          }

          const response = await axios.post('/users/register', { 
            email, 
            nombre, 
            password, 
            anos_experiencia, 
            especialidad, 
            foto, 
            estado 
          });
          alert('Usuario creado correctamente');
          console.log(response);

          // Descomentar estas líneas si todo funciona correctamente
          // localStorage.setItem('token', response.data.token);
          // alert('Usuario creado... redirigiendo al dashboard');
          window.location.href = "/";
        } catch (error) {
          console.error(error);
          if (error.response && error.response.data && error.response.data.msg) {
            alert(error.response.data.msg);
          } else {
            alert('Ocurrió un error al procesar la solicitud.');
          }
        }
      });
    }

    if (actualizarForm) {
      actualizarForm.addEventListener('submit', async (e) => {
        try {
          e.preventDefault();

          const id = 'user_id'; // Reemplaza esto con la lógica para obtener el ID del usuario autenticado
          const email = e.target.email.value;
          const nombre = e.target.nombre.value;
          const password = e.target.password.value;
          const password2 = e.target.password2.value;
          const anos_experiencia = e.target.anos_experiencia.value;
          const especialidad = e.target.especialidad.value;
          const foto = "foto"; // Placeholder
          const estado = true; // Placeholder

          if (password !== password2) {
            alert('Las contraseñas no coinciden');
            return;
          }
          console.log("hola")
          const response = await axios.put(`/users/${id}`, { 
            email, 
            nombre, 
            password, 
            anos_experiencia, 
            especialidad, 
            foto, 
            estado 
          });

          console.log(response);

          // Descomentar estas líneas si todo funciona correctamente
          // localStorage.setItem('token', response.data.token);
          // alert('Usuario actualizado... redirigiendo al dashboard');
          // window.location.href = "/";
        } catch (error) {
          console.error(error);
          if (error.response && error.response.data && error.response.data.msg) {
            alert(error.response.data.msg);
          } else {
            alert('Ocurrió un error al procesar la solicitud.');
          }
        }
      });
    }
  });

