const listBooks = document.querySelector('#listBooks')
const formAddBook = document.querySelector('#formAddBook')
const formUpdateBook = document.querySelector('#formUpdateBook')
const pagination = document.querySelector('#pagination')

const myModal = new bootstrap.Modal('#exampleModal')

const token = localStorage.getItem('token')
if (!token) {
    window.location.href = "/login"
}

const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}

formAddBook.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = e.target.titulo.value
    const author = e.target.author.value
    const price = e.target.price.value

    try {
        await axios.post('/api/v1/books', {
            name, author, price
        }, config)
        getBooks()
        alert('libro agregado')
    } catch (error) {
        console.log(error)
        alert(error.response.data.msg)
    }
})

let PAGE = 1
let ORDERBY = 'id'
let SORT = 'asc'
let LIMIT = 5

const changePage = page => {
    PAGE = page
    getBooks()
}

const changeOrder = (orderby, sort) => {
    ORDERBY = orderby
    SORT = sort
    getBooks()
}

const getBooks = async (url = `/api/v1/books?page=${PAGE}&orderby=${ORDERBY}&sort=${SORT}&limit=${LIMIT}`) => {
    try {
        const { data } = await axios.get(url)
        listBooks.innerHTML = ''
        data.books.forEach(book => {
            listBooks.innerHTML += `
            <li class="list-group-item">
                ${book.id} - ${book.name} - ${book.author} - ${book.price}
                <div class="mt-2">
                    <button onclick="removeBook('${book.id}')" class="btn btn-danger btn-sm">Eliminar</button>
                    <button onclick="updateBook('${book.id}')" class="btn btn-warning btn-sm">Editar</button>
                </div>
            </li>
            `
        })

        createPagination(data)
    } catch (error) {
        console.log(error)
        alert(error.response.data.msg)
    }
}

getBooks()

const createPagination = (data) => {

    const { previous, next, totalPages, currentPage } = data

    pagination.innerHTML = ''
    pagination.innerHTML += `
    <li class="page-item ${!previous ? 'disabled' : ''}">
        <button onclick="getBooks('${previous}')" class="page-link">Previous</button>
    </li>
    `

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
        <li class="page-item ${currentPage === i ? 'active' : ''}">
            <button onclick="changePage(${i})" class="page-link" >${i}</button>
        </li>
        `
    }

    pagination.innerHTML += `
    <li class="page-item ${!next ? 'disabled' : ''}">
        <button onclick="getBooks('${next}')" class="page-link">Next</button>
    </li>
    `
}

const removeBook = async (id) => {
    try {
        await axios.delete('/api/v1/books/' + id, config)
        getBooks()
        alert('se eliminó el libro')
    } catch (error) {
        console.log(error)
        alert(error.response.data.msg)
    }
}

const updateBook = async (id) => {
    try {
        const { data } = await axios.get('/api/v1/books/' + id)
        // console.log(data)

        formUpdateBook.idLibro.value = data.id
        formUpdateBook.titulo.value = data.name
        formUpdateBook.author.value = data.author
        formUpdateBook.price.value = data.price

        myModal.show()
    } catch (error) {
        console.log(error)
        alert(error.response.data.msg)
    }
}

formUpdateBook.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = e.target.titulo.value
    const author = e.target.author.value
    const price = e.target.price.value
    const id = e.target.idLibro.value

    try {
        await axios.put('/api/v1/books/' + id, {
            name, author, price
        }, config)
        getBooks()
        alert('Libro modificado')
        myModal.hide()
    } catch (error) {
        console.log(error)
        alert(error.response.data.msg)
    }
})