const apiUrl = 'https://api.api-ninjas.com/v1/motorcycles?make=Kawasaki&model=Ninja'; //url de la base de motos

fetch(apiUrl, {
    method:"GET",
    headers:{"X-Api-Key":"ZmhN8aOs29cRmuWstFCOLnU9Eyu14wv1sjROftqK"

}

})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('error:', error));