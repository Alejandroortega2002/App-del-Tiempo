const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGV4YW9uLmFvQGdtYWlsLmNvbSIsImp0aSI6IjUwNzUyNGViLTZmNWMtNDU1Mi05ZTc0LWQ2N2NmYThmMWZjNSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNzMyNjQ4OTA2LCJ1c2VySWQiOiI1MDc1MjRlYi02ZjVjLTQ1NTItOWU3NC1kNjdjZmE4ZjFmYzUiLCJyb2xlIjoiIn0.4vR4f6IblHel4WOw9dl1NGyQO3ISAWxhpKwmO7-DFpc';
const BASE_URL = 'https://opendata.aemet.es/opendata/api/';

async function obtenerClima(ciudad) {
  const endpoint = `${BASE_URL}prediccion/especifica/municipio/diaria/${ciudad}/?api_key=${API_KEY}`;
  
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.datos) {
      const climaResponse = await fetch(data.datos);
      const climaData = await climaResponse.json();
      mostrarClimaActual(climaData);
    } else {
      console.error('Error al obtener datos del clima:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function mostrarClimaActual(data) {
  document.getElementById('nombre-ciudad').innerText = data.nombre;
  document.getElementById('temperatura-actual').innerText = `${data.temperatura_actual}°C`;
  document.getElementById('descripcion-actual').innerText = data.estado_cielo.descripcion;
  document.getElementById('viento-actual').innerText = `Viento: ${data.viento} km/h`;
}

// Agrega eventos al botón de buscar
document.getElementById('boton-buscar').addEventListener('click', () => {
  const ciudad = document.getElementById('buscar-ciudad').value;
  if (ciudad) {
    obtenerClima(ciudad);
  }
});
