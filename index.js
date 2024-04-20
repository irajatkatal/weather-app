const apiKey = "d4cc54d7e6b03cb2a40d1b94716041d8";
const imgSectionLBig = document.querySelector(".imgSectionLBig");
const tempratureLBig = document.querySelector(".tempratureLBig");
const timeLBig = document.querySelector(".timeLBig");
const weatherInfoChildLBig = document.querySelector(".weatherInfoChildLBig");
const windDirectionData = document.querySelector(".windDirectionData");
const windSpeedData = document.querySelector(".windSpeedData");
const visibilityData = document.querySelector(".visibilityData");
const windCondition = document.querySelector(".windCondition");
const sunCardData = document.querySelectorAll(".sunCardData");
const humidityData = document.querySelector(".humidityData");
const humidityCondition = document.querySelector(".humidityCondition");
const airqualityCondition = document.querySelector(".airqualityCondition");
const temp = document.querySelectorAll(".temp");

// const windDirectionImg = document.querySelector(".windDirection img");

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

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // const lat = position.coords.latitude;
                // const long = position.coords.longitude;
                const lat = 32.19000201389952;
                const long = 75.46681021437034;
                getWeather(lat, long);
                getAirPolutionData(lat, long);

                // getCityStateName(lat, long);
            },
            (error) => {
                console.log(`Error: ${error.message}`);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

getLocation();

function getWeather(lat, long) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Somthing is Wrong....");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            showWeather(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function showWeather(data) {
    const imgSectionLBigImg = document.createElement("img");
    imgSectionLBigImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    imgSectionLBigImg.alt = "Weather Logo";
    imgSectionLBig.appendChild(imgSectionLBigImg);

    temp[0].addEventListener("click", () => {
        temp[1].classList.remove("active");
        temp[0].classList.add("active");
        tempratureLBig.children[0].innerHTML = `${Math.round(
            data.main.temp - 273.15
        )}<sup>°C</sup>`;
    });
    temp[1].addEventListener("click", () => {
        temp[0].classList.remove("active");
        temp[1].classList.add("active");
        tempratureLBig.children[0].innerHTML = `${Math.round(
            ((data.main.temp - 273.15) * 9) / 5 + 32
        )}<sup>°F</sup>`;
    });

    const tempratureLBigH2 = document.createElement("h2");
    tempratureLBigH2.innerHTML = `${Math.round(
        data.main.temp - 273.15
    )}<sup>°C</sup>`;
    tempratureLBig.appendChild(tempratureLBigH2);

    const weatherInfoChildLBigImg = document.createElement("img");
    weatherInfoChildLBigImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherInfoChildLBig.appendChild(weatherInfoChildLBigImg);

    const weatherInfoChildLBigH2 = document.createElement("h2");
    const outputString = capitalizeEachWord(data.weather[0].description);
    weatherInfoChildLBigH2.textContent = outputString;
    weatherInfoChildLBig.appendChild(weatherInfoChildLBigH2);

    const windSpeedDataH2 = document.createElement("h2");
    windSpeedDataH2.innerHTML =
        Math.round(data.wind.speed * 3.6) + "<span>KM/H</span>";
    windSpeedData.appendChild(windSpeedDataH2);

    degreesToDirection(data.wind.deg);

    let sunRiseDataAPi = getSunRiseSetData(data.sys.sunrise * 1000);
    const setH2 = document.createElement("h2");
    setH2.innerHTML = `${sunRiseDataAPi}<span>AM</span>`;
    sunCardData[0].appendChild(setH2);

    let sunSetDataAPi = getSunRiseSetData(data.sys.sunset * 1000);
    const riseH2 = document.createElement("h2");
    riseH2.innerHTML = `${sunSetDataAPi}<span>PM</span>`;
    sunCardData[1].appendChild(riseH2);

    const humidityDataH2 = document.createElement("h2");
    let humidityLevel = data.main.humidity;
    humidityDataH2.textContent = `${humidityLevel}%`;
    humidityData.appendChild(humidityDataH2);

    let humidityMsg = getHumidityDescription(humidityLevel);

    const humidityDivMsg = document.createElement("h2");
    humidityDivMsg.textContent = humidityMsg;
    humidityCondition.appendChild(humidityDivMsg);

    let visibilityCondition = visibilityMsg(data.visibility);

    const visibilityDataH2 = document.createElement("h2");
    visibilityDataH2.innerHTML =
        Math.round(data.visibility / 1000) + "<span>KM</span>";
    visibilityData.appendChild(visibilityDataH2);

    const windConditionH2 = document.createElement("h2");
    windConditionH2.textContent = visibilityCondition;
    windCondition.appendChild(windConditionH2);
}

function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

function visibilityMsg(visibility) {
    if (visibility <= 50) {
        return "Dense Fog 😑";
    } else if (visibility >= 50 && visibility < 300) {
        return "Modrate Fog 😐";
    } else if (visibility >= 300 && visibility < 600) {
        return "light Fog 😏";
    } else if (visibility >= 600 && visibility < 1700) {
        return "Very Light Fog 😗";
    } else if (visibility >= 1700 && visibility < 3500) {
        return "Light Mist 😉";
    } else if (visibility >= 3500 && visibility < 9000) {
        return "Very Light Mist 🫡";
    } else if (visibility >= 9000 && visibility < 17000) {
        return "Clear Air 😊";
    } else {
        return "Very Clear Air 😎";
    }
}

function getHumidityDescription(humidity) {
    if (humidity < 30) {
        return "Very Low (🌵)"; // Text description with emoji in parentheses
    } else if (humidity <= 40) {
        return "Low (🌵)"; // Text description with emoji in parentheses
    } else if (humidity <= 50) {
        return "Normal (🌳)"; // Text description with emoji following space
    } else if (humidity <= 60) {
        return "Ideal (🌳)"; // Text description with emoji following space
    } else if (humidity <= 70) {
        return "Comfortable (🌳)"; // Text description with emoji following space
    } else {
        return "High (🌳)"; // Text description with emoji following space
    }
}

function getSunRiseSetData(RiseSetdata) {
    const RSData = new Date(RiseSetdata);
    return `${RSData.getHours() % 12 || 12}:${RSData.getMinutes()
        .toString()
        .padEnd(2, 0)}`;
}

function currentTime() {
    const now = new Date();
    let hours = now.getHours();
    let meridian = hours < 12 ? "AM" : "PM";
    hours = (hours % 12 || 12).toString().padStart(2, 0);
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const dayNum = now.getDay();
    timeLBig.innerHTML = `<h2>${weekDays[dayNum]}, <span>${hours}:${minutes} ${meridian}</span></h2>`;
}

setInterval(() => {
    currentTime();
}, 1000);

function degreesToDirection(degree) {
    const directions = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW",
    ];
    const index = Math.round((degree % 360) / 22.5);
    const direction = directions[(index + 16) % 16];
    const logo = {
        N: "navigation-N.png",
        NNE: "navigation-NE.png",
        NE: "navigation-E.png",
        ENE: "navigation-NE.png",
        E: "navigation-E.png",
        ESE: "navigation-SE.png",
        SE: "navigation-E.png",
        SSE: "navigation-SE.png",
        S: "navigation-S.png",
        SSW: "navigation-SW.png",
        SW: "navigation-W.png",
        WSW: "navigation-SW.png",
        W: "navigation-W.png",
        WNW: "navigation-NW.png",
        NW: "navigation-W.png",
        NNW: "navigation-NW.png",
    };

    const windDirectionDataImg = document.createElement("img");
    windDirectionDataImg.src = `images/${logo[direction]}`;
    windDirectionData.appendChild(windDirectionDataImg);

    const windDirectionDataH2 = document.createElement("h2");
    windDirectionDataH2.textContent = direction;
    windDirectionData.appendChild(windDirectionDataH2);
}

function getAirPolutionData(lat, long) {
    fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${apiKey}`
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let airQualityMsg = getAirQualityDescription(data.list[0].main.aqi);
            showAQICondition(airQualityMsg);
        })
        .catch((error) => {
            console.log(error);
        });
}

function getAirQualityDescription(aqi) {
    if (aqi == 1) {
        return "Good";
    } else if (aqi == 2) {
        return "Fair";
    } else if (aqi == 3) {
        return "Moderate";
    } else if (aqi == 4) {
        return "Poor";
    } else if (aqi == 5) {
        return "Very Poor";
    } else {
        return "Severe";
    }
}

function showAQICondition(msg) {
    const airqualityConditionH2 = document.createElement("h2");
    airqualityConditionH2.textContent = msg;
    airqualityCondition.appendChild(airqualityConditionH2);
}
