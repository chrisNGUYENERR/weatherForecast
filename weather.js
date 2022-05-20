const showWeather = () => {
    const zipcode = document.getElementById('zipcode').value;
    locationApi(zipcode).then(locationResponse => {
        weatherApi(locationResponse).then(weatherResponse => {
            forecastApi(weatherResponse.properties.forecast).then(forecastResponse => {
                let forecast = renderWeather(forecastResponse.properties.periods);
                document.getElementById('display').innerHTML = forecast;
            });
        });
    });
};

let button = document.getElementById('button');
button.addEventListener('click', () => {
    showWeather();
});


const locationApi = (zipcode) => {
    const url = `https://api.geocod.io/v1.6/geocode?q=${zipcode}&api_key=661f10101f5551601645516fff5559650249f94`;
    return fetch(url).then(res => {
        return res.json();
    });
};

const weatherApi = (locationRes) => {
    const locationValue = locationRes.results[0].location;
        const longitude = locationValue.lng;
        const latitude = locationValue.lat;
        return fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
        .then(res => {return res.json()})
};

const forecastApi = (forecastUrl) => {
    return fetch(forecastUrl).then(res => {return res.json()})
};


const renderWeather = (weatherRes) => {
    return weatherRes.map((weather) => {
        let {name, icon, shortForecast, temperature, temperatureUnit, windDirection, windSpeed} = weather;
        return `<div class="forecast">
                    <h3>${name}</h3>
                    <img src="${icon}">
                    <div class="description">${shortForecast}</div>
                    <div class="temperature">${convertUnit(temperature)}</div>
                    <div class="wind" id="wind">${checkBox() ? windDirection + windSpeed : ``}</div>
                </div>`
    }).join('');

};

const checkBox = () => {
    let checkWind = document.getElementById('checkWind');

    if (checkWind.checked) {
        return true;
    } else {
        return false;
    }
};

const convertUnit = (fahrenheight) => {
    let celciusRadio = document.getElementById('celcius');
    let celcius = 0;

    if (celciusRadio.checked) {
        celcius = Math.round((fahrenheight - 32) * (5/9));
        return `${celcius}°C`;
    } else {
        return `${fahrenheight}°F`
    }
}