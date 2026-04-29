
const contenedor = document.getElementById("listaPokemon");

const API_KEY = "dKE0WPZP9SDy5EdxFc6SKkiIQOvSoEhE3M3mcKqM";

const CACHE_KEY = "motos_cache";
const CACHE_TIME = 1000 * 60 * 60; // 1 hora

// 🌐 API
async function getMotos() {

    // 🔥 revisar cache primero
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (cache && (Date.now() - cache.timestamp < CACHE_TIME)) {
        console.log("⚡ Usando cache");
        return cache.data;
    }

    console.log("🌐 Llamando API...");

    const marcas = [
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

    let todas = [];

    for (let marca of marcas) {

        try {
            const res = await fetch(`https://api.api-ninjas.com/v1/motorcycles?make=${marca}`, {
                headers: { "X-Api-Key": API_KEY }
            });

            if (!res.ok) {
                console.warn("Error con:", marca, res.status);
                continue;
            }

            const data = await res.json();
            todas = [...todas, ...data];

        } catch (error) {
            console.error("Error fetch:", marca, error);
        }
    }

    // 🔥 guardar cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: todas,
        timestamp: Date.now()
    }));

    return todas;
}

// 🧩 ESTRUCTURA
const estructura = {

    "DATOS GENERALES": {
        make: "Marca",
        model: "Modelo",
        type: "Tipo"
    },

    "MOTOR": {
        displacement: "Cilindraje",
        engine: "Motor",
        compression: "Compresión",
        bore_stroke: "Diámetro x carrera",
        valves_per_cylinder: "Válvulas por cilindro",
        power: "Potencia",
        torque: "Torque"
    },

    "COMBUSTIBLE": {
        fuel_system: "Sistema de combustible",
        fuel_control: "Control de combustible",
        fuel_capacity: "Capacidad de combustible",
        fuel_consumption: "Consumo",
        emission: "Emisiones"
    },

    "TRANSMISIÓN": {
        gearbox: "Caja de cambios",
        transmission: "Transmisión",
        clutch: "Embrague"
    },

    "CHASIS": {
        frame: "Chasis",
        front_suspension: "Suspensión delantera",
        rear_suspension: "Suspensión trasera"
    },

    "FRENOS": {
        front_brakes: "Frenos delanteros",
        rear_brakes: "Frenos traseros"
    },

    "RUEDAS": {
        front_tire: "Llanta delantera",
        rear_tire: "Llanta trasera"
    },

    "DIMENSIONES": {
        seat_height: "Altura del asiento",
        ground_clearance: "Altura libre al suelo",
        wheelbase: "Distancia entre ejes",
        total_weight: "Peso total",
        total_height: "Altura total",
        total_length: "Longitud total",
        total_width: "Ancho total",
        dry_weight: "Peso en seco"
    },

    "OTROS": {
        starter: "Arranque",
        ignition: "Encendido",
        cooling: "Refrigeración",
        lubrication: "Lubricación",
        front_wheel_travel: "Recorrido rueda delantera",
        rear_wheel_travel: "Recorrido rueda trasera",
        top_speed: "Velocidad máxima"
    }
};


// 🎨 RENDER
function render(motos) {

    contenedor.innerHTML = "";

    Object.entries(estructura).forEach(([bloque, campos]) => {

        const bloqueDiv = document.createElement("div");
        bloqueDiv.classList.add("bloque");

        bloqueDiv.innerHTML = `<h1>${bloque}</h1>`;

        Object.entries(campos).forEach(([campo, nombre]) => {

            const valores = [...new Set(
                motos
                    .map(m => m[campo])
                    .filter(v =>
                        v !== null &&
                        v !== undefined &&
                        v !== "" &&
                        v !== "undefined" &&
                        v !== "-" &&
                        v !== "N/A"
                    )
            )];

            if (valores.length === 0) return;

            const seccion = document.createElement("div");
            seccion.classList.add("seccion");

            seccion.innerHTML = `
                <div class="contenido">

                    <div class="info">
                        <h2>${nombre}</h2>
                        <ul>
                            ${valores.map(v => `<li>${v}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="imagen">
                        
                    </div>

                </div>
            `;

            bloqueDiv.appendChild(seccion);
        });

        contenedor.appendChild(bloqueDiv);
    });
}

// 🚀 INIT
async function init() {

    contenedor.innerHTML = `<div class="spinner"></div>`;

    const motos = await getMotos();

    if (!motos || motos.length === 0) {
        contenedor.innerHTML = "<p>No se pudieron cargar datos 😢</p>";
        return;
    }

    render(motos);
}

init();