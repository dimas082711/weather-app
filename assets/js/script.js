var city = [];
var cityName = document.querySelector("#city");



var fetchCity = function() {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid=9197ee3604a9600f19d345148a6daee6"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
console.log(response);
            })
            } else {
                alert("Please Enter A Valid City");
        }
       
    })
    .catch(function(error) {
        alert("Unable to Connect To Weather APP");
    })
}
fetchCity();