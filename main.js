// main.js
const peliculasJSONURL = ('./data.json');
let peliculas = [];
let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
let peliculaSeleccionada = null;

async function getPeliculas() {
    try {
        const response = await fetch('./data.json');

        if (!response.ok) {
            throw new Error('Error al obtener el JSON');
        }

        peliculas = await response.json();
    } catch (error) {
        console.error(error);
    }
}

function mostrarPeliculas() {
    const carteleraString = peliculas.map(
        (item) => `${item.id}. ${item.Movie} - Precio: $${item.precio}`
    ).join('\n');
    
    Swal.fire({
        title: 'Cartelera de Películas',
        text: `Las siguientes películas están disponibles:\n${carteleraString}`,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}

function seleccionarPelicula() {
    Swal.fire({
        title: 'Seleccionar Película',
        text: 'Ingrese el número de la película que desea ver:',
        input: 'number',
        showCancelButton: true,
        confirmButtonText: 'Seleccionar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value) {
                    resolve();
                } else {
                    resolve('Ingrese un número válido de película');
                }
            });
        }
    }).then((result) => {
        if (result.value) {
            const search = Number(result.value);
            peliculaSeleccionada = peliculas.find((item) => item.id === search);

            if (peliculaSeleccionada) {
                Swal.fire({
                    title: 'Película Seleccionada',
                    text: `Has seleccionado la película: "${peliculaSeleccionada.Movie}"`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Película no disponible',
                    text: 'Lo sentimos, la película seleccionada no está disponible.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}
// funcion para comprar entradas
function comprarEntradas() {
    Swal.fire({
        title: 'Número de Entradas',
        text: '¿Cuántas entradas deseas comprar?',
        input: 'number',
        showCancelButton: true,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value && Number(value) > 0) {
                    resolve();
                } else {
                    resolve('Por favor, ingresa un número válido de entradas (mayor que 0).');
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const numbTicket = Number(result.value);

            if (!peliculaSeleccionada) {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, selecciona una película antes de comprar entradas.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const totalCost = numbTicket * peliculaSeleccionada.precio;
    
            const articulo = {
                pelicula: peliculaSeleccionada.Movie,
                cantidadTickets: numbTicket,
                costoTotal: totalCost
            };

            carrito.push(articulo);
    
            sessionStorage.setItem('carrito', JSON.stringify(carrito));

            Swal.fire({
                title: 'Compra Exitosa',
                text: `Has comprado ${numbTicket} entradas de "${peliculaSeleccionada.Movie}" por un total de $${totalCost}`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });
}

// mostrar carrito
function mostrarCarrito() {
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'El carrito está vacío.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    } else {
        const contenidoCarrito = carrito.map((item) => `${item.cantidadTickets} entradas de "${item.pelicula}" - Total: $${item.costoTotal}`).join('\n');
        Swal.fire({
            title: 'Contenido del Carrito',
            text: `Tu carrito contiene:\n\n${contenidoCarrito}`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
}

function borrarCarrito() {
    sessionStorage.clear();
    
    Swal.fire({
        title: 'Carrito Eliminado',
        text: 'El carrito ha sido eliminado.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    location.reload();
}

// Eventos
document.getElementById("verCartelera").addEventListener("click", async function() {await getPeliculas();mostrarPeliculas();});
document.getElementById("seleccionarPelicula").addEventListener("click", seleccionarPelicula);
document.getElementById("comprarEntradas").addEventListener("click", comprarEntradas);
document.getElementById("mostrarCarrito").addEventListener("click", mostrarCarrito);
document.getElementById("borrarCarrito").addEventListener("click", borrarCarrito);
