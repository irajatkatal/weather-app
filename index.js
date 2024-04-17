const key = "d4cc54d7e6b03cb2a40d1b94716041d8";
const display = document.getElementById("display");
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const City = document.querySelector(".city");
const state = document.querySelector(".state");
const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const monthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function currentTime() {
    const now = new Date();
    let hours = now.getHours();
    let meridian = hours < 12 ? "AM" : "PM";
    hours = (hours % 12 || 12).toString().padStart(2, 0);
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    const dayName = now.getDay();
    const dateNum = now.getDate();
    const monthNum = now.getMonth();
    const year = now.getFullYear();
    time.innerHTML = `${hours}:${minutes}:${seconds} <span>${meridian}</span>`;
    date.innerHTML = `${weekDays[dayName]}, ${dateNum} ${monthsName[monthNum]} ${year}`;
}

setInterval(() => {
    currentTime();
}, 1000);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                // const lat = 43.683334;
                // const long = -79.766670;
                getWeather(lat, long);
                getCityStateName(lat, long);
            },
            (error) => {
                alert(`Error: ${error.message}`);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

getLocation();

function getWeather(lat, long) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Somthing is Wrong....");
            }
            return response.json();
        })
        .then((data) => {
            showWeather(data);
        })
        .catch((error) => {
            alert(error);
        });
}

function getCityStateName(lat, long) {
    fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=4760db81a38f4ba6b696943ee6313191`
    )
        .then((response) => {
            if(!response.ok){
                throw new Error('Error while finding location')
            }
            return response.json();
        })
        .then((data) => {
            showCityStateName(data);
        })
        .catch((error) => {
            console.error(error);
        });
}

function showCityStateName(data) {
    const CityName = data.features[0].properties.city;
    const StateName = data.features[0].properties.state || CityName;
    const country = data.features[0].properties.country;
    City.textContent = CityName;
    state.innerHTML = `${StateName}, ${country}`;
    console.log(data)
}

function showWeather(data) {
    // console.log(data);
}
