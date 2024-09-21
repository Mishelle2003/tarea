// Selección de elementos del DOM
const buscarBtn = document.querySelector('#buscarBtn');
const inputFiltro = document.querySelector('#filtro');
const resultados = document.querySelector('#resultados');
const botonAnterior = document.querySelector('#anterior');
const botonSiguiente = document.querySelector('#siguiente');

// URL base de la API
let apiUrl = 'https://pokeapi.co/api/v2/pokemon';

// Función para obtener datos de la API
const obtenerDatos = async (url) => {
    const respuesta = await fetch(url);
    return await respuesta.json();
};

// Crear tarjeta de Pokémon
const crearTarjeta = (imagen, nombre, experiencia) => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('card');

    tarjeta.innerHTML = `
        <img src="${imagen}" alt="Imagen de ${nombre}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">Experiencia: ${experiencia}</p>
            <button class="btn">Más información</button>
        </div>
    `;

    resultados.appendChild(tarjeta);
};

// Mostrar tarjetas
const mostrarTarjetas = async (url) => {
    const { results } = await obtenerDatos(url);

    resultados.innerHTML = ''; // Limpiar resultados anteriores
    results.forEach(async (elemento) => {
        const { name, url } = elemento;
        const infoElemento = await fetch(url);
        const { base_experience, sprites } = await infoElemento.json();
        const imagen = sprites.other['official-artwork']?.front_default || sprites.front_default;
        crearTarjeta(imagen, name, base_experience);
    });
};

// Buscar Pokémon por nombre
const buscarElemento = async (nombre) => {
    const urlBusqueda = 'https://pokeapi.co/api/v2/pokemon';
    let resultadosBusqueda = [];

    while (urlBusqueda) {
        const api = await fetch(urlBusqueda);
        const { next, results } = await api.json();

        const resultadosFiltrados = results.filter(e => e.name.includes(nombre.toLowerCase()));
        resultadosBusqueda = [...resultadosBusqueda, ...resultadosFiltrados];
        urlBusqueda = next;
    }

    resultadosBusqueda.forEach(async ({ name, url }) => {
        const { sprites, base_experience } = await fetch(url).then(r => r.json());
        const imagen = sprites.other['official-artwork']?.front_default || sprites.front_default;
        crearTarjeta(imagen, name, base_experience);
    });
};

// Event Listeners
buscarBtn.addEventListener('click', () => {
    const nombre = inputFiltro.value.trim();
    if (nombre) {
        buscarElemento(nombre);
    } else {
        alert('Por favor, ingresa un nombre para buscar.');
    }
});

// Inicializar aplicación
mostrarTarjetas(apiUrl);