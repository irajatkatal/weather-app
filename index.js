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
                console.log(position);
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
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=100&appid=${key}`
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            showCityStateName(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function showCityStateName(data) {
    const CityName = data[0].name;
    const StateName = data[0].state || CityName;
    const country = data[0].country;
    City.textContent = CityName;
    state.innerHTML = `${StateName}, ${country}`;
    console.log(data);
    console.log(country);
}

function showWeather(data) {
    // console.log(data);
}
