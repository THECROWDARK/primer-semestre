var toggleButtons = document.querySelectorAll(".button__toggle");
var contents = document.querySelectorAll(".main__section__five--links--link--content");

for (var i = 0; i < contents.length; i++) {
    contents[i].style.display = "none";
}

function toggleContent(index) {
    if (contents[index].style.display ==="none") {
      contents[index].style.display = "block";
      toggleButtons[index].innerHTML = "🏍";
    } else {
      contents[index].style.display = "none";
      toggleButtons[index].innerHTML = "🏍";
    }
}

for (var i = 0; i < toggleButtons.length; i++) {
    toggleButtons[i].addEventListener(
        "click",
        (function (index) {
            return function () {
                toggleContent(index);
            };
        }) (i)
    );
}









/////const apiUrl = 'https://api.api-ninjas.com/v1/motorcycles?make=Kawasaki&model=Ninja'; //url de la base de motos

/////fetch(apiUrl, {
/////    method:"GET",
/////    headers:{"X-Api-Key":"ZmhN8aOs29cRmuWstFCOLnU9Eyu14wv1sjROftqK"

/////}

/////})
/////    .then(response => response.json())
/////    .then(data => console.log(data))
/////    .catch(error => console.error('error:', error));/////