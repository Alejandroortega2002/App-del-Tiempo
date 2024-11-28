const API_KEY = '5b927e08362654bf34e9bc3a76652189';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
let unidades = 'metric'; // 'metric' para °C, 'imperial' para °F'

// Mapeo de códigos de OpenWeatherMap a tus íconos personalizados
const iconosClimaticos = {
  "01d": "clear-day",
  "01n": "clear-night",
  "02d": "cloudy-day-1",
  "02n": "cloudy-night-1",
  "03d": "cloudy-day-2",
  "03n": "cloudy-night-2",
  "04d": "cloudy-day-3",
  "04n": "cloudy-night-3",
  "09d": "rainy-1",
  "09n": "rainy-1",
  "10d": "rainy-3",
  "10n": "rainy-3",
  "11d": "thunder",
  "11n": "thunder",
  "13d": "snowy-1",
  "13n": "snowy-1",
  "50d": "cloudy",
  "50n": "cloudy"
};

const iconosPersonalizados = {
  "clear-day": "multimedia/day.svg",
  "clear-night": "multimedia/night.svg",
  "cloudy-day-1": "multimedia/cloudy-day-1.svg",
  "cloudy-day-2": "multimedia/cloudy-day-2.svg",
  "cloudy-day-3": "multimedia/cloudy-day-3.svg",
  "cloudy-night-1": "multimedia/cloudy-night-1.svg",
  "cloudy-night-2": "multimedia/cloudy-night-2.svg",
  "cloudy-night-3": "multimedia/cloudy-night-3.svg",
  "rainy-1": "multimedia/rainy-1.svg",
  "rainy-3": "multimedia/rainy-3.svg",
  "thunder": "multimedia/thunder.svg",
  "snowy-1": "multimedia/snowy-1.svg",
  "default": "multimedia/weather.svg"
};

// Función para obtener el clima actual
async function obtenerClima(ciudad) {
  const url = `${BASE_URL}weather?q=${ciudad}&appid=${API_KEY}&units=${unidades}&lang=es`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      mostrarClima(data);
      obtenerPronosticoHoras(ciudad); // Llama al pronóstico por horas
      obtenerPronostico5Dias(ciudad); // Llama al pronóstico de 5 días
      mostrarSecciones(); // Mostrar las secciones al realizar una búsqueda exitosa
    } else {
      mostrarError(`No se encontró la ciudad "${ciudad}".`);
    }
  } catch (error) {
    console.error('Error al obtener el clima:', error);
    mostrarError('No se pudo conectar con la API.');
  }
}

// Función para mostrar el clima actual
function mostrarClima(data) {
  const ciudad = data.name;
  const temperatura = data.main.temp;
  const descripcion = data.weather[0].description;
  const viento = data.wind.speed;
  const sensacion = data.main.feels_like;
  const humedad = data.main.humidity;
  const iconoOWM = data.weather[0].icon; // Código del ícono
  const iconoPersonalizado = iconosClimaticos[iconoOWM] || "default";

  // Actualiza la interfaz
  document.getElementById('nombre-ciudad').innerText = ciudad;
  document.getElementById('temperatura-actual').innerText = `${temperatura}°${unidades === 'metric' ? 'C' : 'F'}`;
  document.getElementById('descripcion-actual').innerText = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
  document.getElementById('viento-actual').innerText = `Viento: ${viento} km/h`;
  document.getElementById('sensacion-actual').innerText = `Sensación Térmica: ${sensacion}°${unidades === 'metric' ? 'C' : 'F'}`;
  document.getElementById('humedad-actual').innerText = `Humedad: ${humedad}%`;
  document.getElementById('icono-actual').src = iconosPersonalizados[iconoPersonalizado];
}

// Función para obtener el pronóstico por horas
async function obtenerPronosticoHoras(ciudad) {
  const url = `${BASE_URL}forecast?q=${ciudad}&appid=${API_KEY}&units=${unidades}&lang=es`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === '200') {
      mostrarPronosticoHoras(data.list.slice(0, 8)); // Muestra las próximas 8 horas
    } else {
      mostrarError('No se pudo cargar el pronóstico por horas.');
    }
  } catch (error) {
    console.error('Error al obtener el pronóstico por horas:', error);
    mostrarError('No se pudo conectar con la API.');
  }
}

// Función para mostrar las tarjetas del pronóstico por horas
function mostrarPronosticoHoras(lista) {
  const contenedorHoras = document.getElementById('contenedor-horas');
  contenedorHoras.innerHTML = ''; // Limpia el contenido previo

  lista.forEach((hora) => {
    const horaTexto = new Date(hora.dt * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const temperatura = hora.main.temp;
    const iconoOWM = hora.weather[0].icon; // Código del ícono
    const iconoPersonalizado = iconosClimaticos[iconoOWM] || "default";

    const tarjeta = `
      <div class="tarjeta-hora">
        <p>${horaTexto}</p>
        <img src="${iconosPersonalizados[iconoPersonalizado]}" alt="Icono del clima">
        <p>${temperatura}°${unidades === 'metric' ? 'C' : 'F'}</p>
      </div>
    `;
    contenedorHoras.innerHTML += tarjeta;
  });
}

// Función para obtener el pronóstico de 5 días
async function obtenerPronostico5Dias(ciudad) {
  const url = `${BASE_URL}forecast?q=${ciudad}&appid=${API_KEY}&units=${unidades}&lang=es`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === '200') {
      const dias = agruparPorDia(data.list);
      mostrarPronostico5Dias(dias);
    } else {
      mostrarError('No se pudo cargar el pronóstico de 5 días.');
    }
  } catch (error) {
    console.error('Error al obtener el pronóstico de 5 días:', error);
    mostrarError('No se pudo conectar con la API.');
  }
}

// Agrupa el pronóstico por día
function agruparPorDia(lista) {
  const dias = {};
  lista.forEach((item) => {
    const fecha = new Date(item.dt * 1000).toLocaleDateString();
    if (!dias[fecha]) {
      dias[fecha] = [];
    }
    dias[fecha].push(item);
  });
  return Object.entries(dias);
}

// Muestra el pronóstico de 5 días
function mostrarPronostico5Dias(dias) {
  const contenedorDias = document.getElementById('contenedor-5-dias');
  contenedorDias.innerHTML = ''; // Limpia el contenido previo

  dias.forEach(([fecha, pronosticos]) => {
    const temperaturas = pronosticos.map((p) => p.main.temp);
    const tempMax = Math.max(...temperaturas);
    const tempMin = Math.min(...temperaturas);
    const iconoOWM = pronosticos[0].weather[0].icon; // Código del ícono
    const iconoPersonalizado = iconosClimaticos[iconoOWM] || "default";

    const tarjeta = `
      <div class="tarjeta-dia">
        <p>${fecha}</p>
        <img src="${iconosPersonalizados[iconoPersonalizado]}" alt="Icono">
        <p>Max: ${tempMax}°${unidades === 'metric' ? 'C' : 'F'}</p>
        <p>Min: ${tempMin}°${unidades === 'metric' ? 'C' : 'F'}</p>
      </div>
    `;
    contenedorDias.innerHTML += tarjeta;
  });
}

// El resto del código se mantiene igual.


// Función para mostrar las ciudades destacadas con su información básica
async function mostrarCiudadesDestacadas() {
  const ciudades = ['Londres', 'Nueva York', 'París', 'Tokio', 'Madrid'];
  const contenedorCiudades = document.getElementById('ciudades-destacadas');
  contenedorCiudades.innerHTML = ''; // Limpia las tarjetas previas si existen

  for (const ciudad of ciudades) {
    const url = `${BASE_URL}weather?q=${ciudad}&appid=${API_KEY}&units=${unidades}&lang=es`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        // Crear tarjeta para la ciudad
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-ciudad';

        const icono = data.weather[0].icon;
        const descripcion = data.weather[0].description;
        const temperatura = data.main.temp;

        tarjeta.innerHTML = `
          <h3>${ciudad}</h3>
          <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="Icono del clima">
          <p>${temperatura}°${unidades === 'metric' ? 'C' : 'F'}</p>
          <p>${descripcion.charAt(0).toUpperCase() + descripcion.slice(1)}</p>
        `;

        // Agregar evento de clic para cargar información detallada y subir al inicio
        tarjeta.addEventListener('click', () => {
          obtenerClima(ciudad); // Carga la información de la ciudad
          window.scrollTo({
            top: 0, // Lleva al inicio de la página
            behavior: 'smooth' // Desplazamiento suave
          });
        });

        contenedorCiudades.appendChild(tarjeta);
      }
    } catch (error) {
      console.error(`Error al obtener la información de ${ciudad}:`, error);
    }
  }

  // Mostrar la sección "Otras Ciudades" después de cargar las tarjetas
  document.getElementById('ciudades-destacadas').classList.remove('oculto');
}

// Función para mostrar secciones tras buscar o seleccionar una ciudad
function mostrarSecciones() {
  document.getElementById('clima-actual').classList.remove('oculto');
  document.getElementById('pronostico-horas').classList.remove('oculto');
  document.getElementById('pronostico-5-dias').classList.remove('oculto');
  document.querySelectorAll('.titulo-seccion').forEach((titulo) => {
    titulo.classList.remove('oculto');
  });
  document.getElementById('boton-unidades').classList.remove('oculto');
  document.getElementById('ciudades-destacadas').classList.remove('oculto');
}

// Muestra mensajes de error
function mostrarError(mensaje) {
  alert(mensaje); // Puedes reemplazar esto con un mensaje dinámico en la interfaz
}

// Alternar unidades
document.getElementById('boton-unidades').addEventListener('click', () => {
  unidades = unidades === 'metric' ? 'imperial' : 'metric';
  const ciudad = document.getElementById('buscar-ciudad').value;
  if (ciudad) obtenerClima(ciudad);
});

// Evento para buscar
document.getElementById('boton-buscar').addEventListener('click', () => {
  const ciudad = document.getElementById('buscar-ciudad').value;
  if (ciudad) {
    obtenerClima(ciudad);
    mostrarCiudadesDestacadas(); // Llama a la función para cargar las ciudades destacadas
  }
});

// Inicializar las ciudades destacadas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ciudades-destacadas').classList.add('oculto'); // Ocultar inicialmente
});
