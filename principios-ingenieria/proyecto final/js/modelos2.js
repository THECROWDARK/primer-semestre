const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".filtros");

// 🔥 CONFIG CACHE
const CACHE_KEY = "motosCache";
const CACHE_TIME = 1000 * 60 * 60; // 1 hora

const API_KEY = "55389765-e0380867fda912d5ea66911f4";

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

// 🧠 imagen
async function obtenerImagen(make, model) {
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${make}+${model}+motorcycle`
    );
    const data = await res.json();

    return data.hits?.[0]?.webformatURL ||
      "../img/sin-imagen.png";

  } catch {
    return "https://placehold.co/400x300?text=Error";
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
                <p>porro</p>
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

  renderMotos(); // 🔥 muestra skeleton inicial

  for (let make of makes) {
    console.log("🚀 Llamando API para:", make);
    try {
      const res = await fetch(URL + encodeURIComponent(make), {
        headers: { "X-Api-Key": "dKE0WPZP9SDy5EdxFc6SKkiIQOvSoEhE3M3mcKqM" }
      });
      console.log("📡 Status:", res.status);

      if (!res.ok) {
        console.warn("❌ Error con:", make);
        continue;
      }

      const data = await res.json();
      console.log("📦 Data:", data);
      if (!Array.isArray(data)) continue;

      for (let m of data) {

        const img = await obtenerImagen(m.make, m.model);

        // 🔥 guardar en memoria
        todasLasMotos.push({ data: m, img });

        // 🔥 renderiza con el filtro actual
        renderMotos();

        
      }

    } catch (e) {
      console.error(e);
    }
  }

  // 🔥 guardar cache con timestamp
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: todasLasMotos,
    timestamp: Date.now()
  }));
}

// 🎯 filtros activos EN TIEMPO REAL
botonesHeader.forEach(boton => {
  boton.addEventListener("click", () => {
    filtroActual = boton.id;
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