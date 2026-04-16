const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".filtros");
let URL = "https://api.api-ninjas.com/v1/motorcycles?make=";

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

const API_KEY = "55389765-e0380867fda912d5ea66911f4";

async function obtenerImagen(make, model) {
    const query = `${make} ${model} motorcycle`;

    const res = await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`);

    const data = await res.json();

    if (data.hits.length > 0) {
        return data.hits[0].webformatURL;
    } else {
        return "https://placehold.co/400x300?text=No+Image";
    }
}

for  (let i of makes) {
    fetch(URL + i, {
        method:"GET",
            headers:{"X-Api-Key":"ZmhN8aOs29cRmuWstFCOLnU9Eyu14wv1sjROftqK"

    }}) //concatenar
        .then((response) => response.json())
        ///.then(data => mostrarPokemon(data))
        ///.then(data => {for (let m of data) console.log(m)})}
        .then(data => {for (let m of data) mostrarPokemon(m)})}



async function mostrarPokemon(poke) {

    const imagen = await obtenerImagen(poke.make, poke.model);

    const div = document.createElement("div");
    div.classList.add("pokemon");

    div.innerHTML = `
        <div class="card-inner">
            <div class="card front">
                
                <div class="pokemon-imagen">
                    <img src="${imagen}" alt="${poke.make}">
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

    // 🔥 AQUÍ SÍ (después de crear el HTML)
    const cardInner = div.querySelector(".card-inner");

    div.addEventListener("click", () => {
        cardInner.classList.toggle("flip");
    });

    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for  (let i of makes) {
    fetch(URL + i, {
        method:"GET",
            headers:{"X-Api-Key":"ZmhN8aOs29cRmuWstFCOLnU9Eyu14wv1sjROftqK"

            }})
            .then((response) => response.json())
            .then(data => {for (let m of data){

           

                if(botonId === "ver-todos") {
                    mostrarPokemon(m);
                } else {
                    if (m.make === botonId) {
                        mostrarPokemon(m);
                    }
                } }

            })
    }
}))