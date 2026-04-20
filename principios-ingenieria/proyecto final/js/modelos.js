const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".filtros");

// 🔥 CONFIG CACHE
const CACHE_KEY = "motosCache";
const CACHE_TIME = 1000 * 60 * 60; // 1 hora



let URL = "https://api.api-ninjas.com/v1/motorcycles?make=";

// 🔥 estado global
let todasLasMotos = [];
let filtroActual = "ver-todos";

const makes = [
  "Honda",
  "Yamaha",
  "Kawasaki",
  "Suzuki",
  "BMW",
  "Ducati",
  "KTM",
  "Triumph",
  "Aprilia",
  "Harley-Davidson",
  "Indian",
  "MV Agusta",
  "Benelli",
  "Husqvarna",
  "Moto Guzzi",
  "Royal Enfield",
  "CFMoto",
  "Bajaj",
  "TVS",
  "GasGas",
  "Zero"
];

const traducciones = {
  make: "Marca",
  model: "Modelo",
  year: "Año",
  type: "Tipo",
  displacement: "Cilindraje",
  engine: "Motor",
  compression: "Compresión",
  bore_stroke: "Diámetro x carrera",
  valves_per_cylinder: "Válvulas por cilindro",
  fuel_system: "Sistema de combustible",
  fuel_control: "Control de combustible",
  lubrication: "Lubricación",
  cooling: "Refrigeración",
  gearbox: "Caja de cambios",
  transmission: "Transmisión",
  clutch: "Embrague",
  frame: "Chasis",
  front_suspension: "Suspensión delantera",
  rear_suspension: "Suspensión trasera",
  front_wheel_travel: "Recorrido rueda delantera",
  rear_wheel_travel: "Recorrido rueda trasera",
  front_tire: "Llanta delantera",
  rear_tire: "Llanta trasera",
  front_brakes: "Frenos delanteros",
  rear_brakes: "Frenos traseros",
  seat_height: "Altura del asiento",
  ground_clearance: "Altura libre al suelo",
  wheelbase: "Distancia entre ejes",
  fuel_capacity: "Capacidad de combustible",
  starter: "Arranque",
  power: "Potencia",
  torque: "Torque",
  top_speed: "Velocidad máxima",
  fuel_consumption: "Consumo",
  emission: "Emisiones",
  total_weight: "Peso total",
  total_height: "Altura total",
  total_length: "Longitud total",
  total_width: "Ancho total",
  ignition: "Encendido",
  dry_weight: "Peso en seco"
};

// 🧠 delay
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// 🧠 skeleton
function crearSkeleton() {
  const div = document.createElement("div");
  div.classList.add("pokemon", "skeleton");

  div.innerHTML = `
    <div class="skeleton-img">
    
    </div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text small"></div>
  `;
  return div;
}

const PEXELS_KEY = "xJp41ykK8yi0nLwsCWpPtmnx8SD6O4jlRFp3A0zZrUK34bJxJe8utRVv";
// 🧠 imagen
async function obtenerImagen(make, model) {
  try {

    const queries = [
      `${make} ${model} motorcycle`,
      `${make} motorcycle`,
      `${model} motorcycle`,
      `motorcycle ${make}`,
      `motorcycle`
    ];

    for (let q of queries) {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5`,
        {
          headers: {
            Authorization: PEXELS_KEY
          }
        }
      );

      const data = await res.json();

      if (data.photos && data.photos.length > 0) {
        const random = data.photos[Math.floor(Math.random() * data.photos.length)];
        return random.src.medium; 
      }
    }

    return "../img/sin-imagen.png";

  } catch {
    return "../img/sin-imagen.png";
  }
}

// 🧠 render tarjeta
function pintarMoto(poke, imagen) {
  const div = document.createElement("div");
  div.classList.add("pokemon");

  div.innerHTML = `
     <div class="card-inner">
            <div class="card front">
                
                <div class="pokemon-imagen">
                    <img src="${imagen}" 
                    alt="${poke.make}" 
                    onerror="this.src='../img/sin-imagen.png'">
                </div>
                <div class="pokemon-info">
                    <div class="nombre-contenedor">
                        <p class="pokemon-id">${poke.make}</p>
                        <h2 class="pokemon-nombre">${poke.model}</h2>
                    </div>
                    <div class="pokemon-tipos">
                        <p class="${poke.type} tipo">${poke.type}</p>
                    </div>
                    <div class="pokemon-stats">
                        <p class="stat">${poke.year}</p>
                        <p class="stat">${poke.gearbox}</p>
                    </div>
                </div>
            </div>

            <div class="card back">
              <div class="moto-detalles">
                ${Object.entries(poke)
                  .map(([key, value]) => `
                    <p><strong>${traducciones[key] || key}:</strong> ${value ?? "N/A"}</p>
                  `)
                  .join("")}
              </div>
            </div>  
        </div>
    `;
  const cardInner = div.querySelector(".card-inner");

  div.addEventListener("click", () => {
    cardInner.classList.toggle("flip");
  });

  return div;
}

const SKELETON_COUNT = 9;

// 🔥 render con filtro dinámico
function renderMotos() {
  listaPokemon.innerHTML = "";

  const filtradas = todasLasMotos.filter(m => {
    return filtroActual === "ver-todos" || m.data.make === filtroActual;
  });

  filtradas.forEach(m => {
    const card = pintarMoto(m.data, m.img);
    listaPokemon.append(card);
  });

  // si no hay nada aún → skeleton
  if (filtradas.length === 0) {
    for (let i = 0; i < SKELETON_COUNT; i++) {
      listaPokemon.append(crearSkeleton());
    }
  }
}

// 🚀 carga progresiva REAL
async function cargarMotos() {

  renderMotos(); // 🔥 skeleton inmediato

  const inicio = Date.now(); // ⏱️ medir tiempo

  const resultados = await Promise.all(
    makes.map(async (make) => {
      try {
        const res = await fetch(URL + encodeURIComponent(make), {
          headers: { "X-Api-Key": "dKE0WPZP9SDy5EdxFc6SKkiIQOvSoEhE3M3mcKqM" }
        });

        if (!res.ok) return [];

        const data = await res.json();

        return await Promise.all(
          data.map(async (m) => {
            const img = await obtenerImagen(m.make, m.model);
            return { data: m, img };
          })
        );

      } catch {
        return [];
      }
    })
  );

  todasLasMotos = resultados.flat();

  // 🔥 asegurar mínimo 2 segundos de carga
  const tiempoTranscurrido = Date.now() - inicio;

  const tiempo_carga = 1500;

  if (tiempoTranscurrido < tiempo_carga) {
    await delay(tiempo_carga - tiempoTranscurrido);
  }

  // 🔥 render FINAL (todo junto)
  renderMotos();

  // 🔥 guardar cache
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: todasLasMotos,
    timestamp: Date.now()
  }));
}

// 🎯 filtros activos EN TIEMPO REAL
botonesHeader.forEach(boton => {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.make || boton.id;
    renderMotos(); // 🔥 re-render inmediato
  });
});

// 🔥 cargar cache si existe
const cacheData = JSON.parse(localStorage.getItem(CACHE_KEY));

if (cacheData && Date.now() - cacheData.timestamp < CACHE_TIME) {
  console.log("⚡ Usando cache");
  todasLasMotos = cacheData.data;
  renderMotos();
} else {
  console.log("🌐 Cargando desde API");
  cargarMotos();
}