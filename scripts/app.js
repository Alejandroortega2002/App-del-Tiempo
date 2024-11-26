// Configuración de la API de AEMET
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGV4YW9uLmFvQGdtYWlsLmNvbSIsImp0aSI6IjUwNzUyNGViLTZmNWMtNDU1Mi05ZTc0LWQ2N2NmYThmMWZjNSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNzMyNjQ4OTA2LCJ1c2VySWQiOiI1MDc1MjRlYi02ZjVjLTQ1NTItOWU3NC1kNjdjZmE4ZjFmYzUiLCJyb2xlIjoiIn0.4vR4f6IblHel4WOw9dl1NGyQO3ISAWxhpKwmO7-DFpc';
const BASE_URL = 'https://opendata.aemet.es/opendata/api/';

// Obtener clima por ciudad (ID de municipio)
async function obtenerClima(ciudadId) {
  const url = `${BASE_URL}prediccion/especifica/municipio/diaria/${ciudadId}/?api_key=${API_KEY}`;

  try {
    // Llamada a la API para obtener los datos
    const response = await fetch(url);
    const data = await response.json();

    if (data.estado === 200 && data.datos) {
      // Segunda llamada para obtener los datos reales
      const datosResponse = await fetch(data.datos);
      const datosClima = await datosResponse.json();

      console.log('Datos del clima recibidos:', datosClima); // Depuración
      mostrarClima(datosClima);
      mostrarPronostico5Dias(datosClima);
    } else {
      mostrarError('Error al obtener los datos del clima: ' + (data.descripcion || 'Error desconocido.'));
    }
  } catch (error) {
    mostrarError('Error de conexión o problema con la API.');
    console.error('Error al obtener los datos del clima:', error);
  }
}

// Mostrar clima actual en la interfaz
function mostrarClima(datosClima) {
  const hoy = datosClima[0]?.prediccion?.dia[0]; // Ajusta según la estructura de la API

  if (hoy) {
    const ciudad = datosClima[0]?.nombre || 'Sin información';
    const temperaturaMax = hoy.temperatura?.maxima || '--';
    const temperaturaMin = hoy.temperatura?.minima || '--';
    const estadoCielo = hoy.estadoCielo?.descripcion || 'Sin información';
    const velocidadViento = hoy.viento?.[0]?.velocidad || '--';

    // Actualiza la interfaz
    document.getElementById('nombre-ciudad').innerText = ciudad;
    document.getElementById('temperatura-actual').innerText = `Max: ${temperaturaMax}°C / Min: ${temperaturaMin}°C`;
    document.getElementById('descripcion-actual').innerText = estadoCielo;
    document.getElementById('viento-actual').innerText = `Viento: ${velocidadViento} km/h`;
  } else {
    mostrarError('No se pudo obtener la predicción del día actual.');
  }
}

// Mostrar pronóstico de 5 días en la interfaz
function mostrarPronostico5Dias(datosClima) {
  const contenedorPronostico = document.getElementById('pronostico-diario');
  contenedorPronostico.innerHTML = ''; // Limpia el contenido anterior

  const dias = datosClima[0]?.prediccion?.dia || []; // Ajusta según la estructura de la API

  dias.forEach((dia) => {
    const fecha = dia.fecha || 'Sin fecha';
    const estadoCielo = dia.estadoCielo?.descripcion || 'Sin información';
    const tempMax = dia.temperatura?.maxima || '--';
    const tempMin = dia.temperatura?.minima || '--';

    const tarjeta = `
      <div class="tarjeta-pronostico">
        <p>${fecha}</p>
        <p>${estadoCielo}</p>
        <p>Max: ${tempMax}°C</p>
        <p>Min: ${tempMin}°C</p>
      </div>
    `;
    contenedorPronostico.innerHTML += tarjeta;
  });
}

// Manejo de ciudades destacadas
const ciudadesDestacadas = ['28079', '08019', '46250']; // Madrid, Barcelona, Valencia
function cargarCiudadesDestacadas() {
  const contenedorCiudades = document.getElementById('ciudades-destacadas');
  contenedorCiudades.innerHTML = ''; // Limpia el contenido anterior

  ciudadesDestacadas.forEach(async (ciudadId) => {
    const url = `${BASE_URL}prediccion/especifica/municipio/diaria/${ciudadId}/?api_key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.estado === 200 && data.datos) {
        const datosResponse = await fetch(data.datos);
        const datosClima = await datosResponse.json();
        const hoy = datosClima[0]?.prediccion?.dia[0];

        if (hoy) {
          const ciudad = datosClima[0]?.nombre || 'Sin información';
          const estadoCielo = hoy.estadoCielo?.descripcion || 'Sin información';
          const tempActual = hoy.temperatura?.maxima || '--';

          const tarjeta = `
            <div class="tarjeta-ciudad">
              <h4>${ciudad}</h4>
              <p>${estadoCielo}</p>
              <p>${tempActual}°C</p>
            </div>
          `;
          contenedorCiudades.innerHTML += tarjeta;
        }
      }
    } catch (error) {
      console.error(`Error al cargar la ciudad destacada ${ciudadId}:`, error);
    }
  });
}

// Mostrar errores al usuario
function mostrarError(mensaje) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.innerText = mensaje;
  document.body.appendChild(errorDiv);

  setTimeout(() => errorDiv.remove(), 5000); // Elimina el mensaje después de 5 segundos
}

// Evento para buscar una ciudad
document.getElementById('boton-buscar').addEventListener('click', () => {
  const ciudadId = document.getElementById('buscar-ciudad').value;

  if (ciudadId) {
    obtenerClima(ciudadId);
  } else {
    mostrarError('Por favor, introduce un ID válido.');
  }
});

// Cargar ciudades destacadas al inicio
cargarCiudadesDestacadas();
