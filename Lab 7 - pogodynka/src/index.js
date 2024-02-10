"use strict";
class WeatherProvider {
    maxCacheTime = 1000 * 60 * 5;
    async getWeather(cityName) {
        const cached = await this.tryCache(cityName);
        if (cached) {
            return cached;
        }
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=f4c40b1db9a0b1adaf8ccb2630ae6263&units=metric`);
            const data = await response.json();
            const weather = {
                cityName,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                icon: data.weather[0].icon,
            };
            localStorage.setItem(`cache-${cityName}`, JSON.stringify({ weather, timestamp: Date.now() }));
            return weather;
        }
        catch (error) {
            console.error('Error fetching weather', error);
            return null;
        }
    }
    async tryCache(cityName) {
        const cache = localStorage.getItem(`cache-${cityName}`);
        if (!cache) {
            return null;
        }
        const cacheEntry = JSON.parse(cache);
        if (Date.now() - cacheEntry.timestamp > this.maxCacheTime) {
            localStorage.removeItem(`cache-${cityName}`);
            return null;
        }
        return cacheEntry.weather;
    }
}
class PlacesManager {
    getPlaces() {
        const cities = localStorage.getItem('cities');
        if (!cities) {
            return [];
        }
        return JSON.parse(cities);
    }
    addPlace(cityName) {
        const cities = this.getPlaces();
        cities.push(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
    removePlace(cityName) {
        const cities = this.getPlaces();
        const newCities = cities.filter((city) => city !== cityName);
        localStorage.setItem('cities', JSON.stringify(newCities));
    }
}
class WeatherRenderer {
    static render(weather, placesManager) {
        const weatherDiv = document.createElement('div');
        weatherDiv.innerHTML = `
			<h2>${weather.cityName}</h2>
			<p>Temperature: ${weather.temperature}</p>
			<p>Humidity: ${weather.humidity}</p>
			<img src="http://openweathermap.org/img/w/${weather.icon}.png" />
		`;
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.onclick = () => {
            placesManager.removePlace(weather.cityName);
            weatherDiv.remove();
        };
        weatherDiv.appendChild(removeButton);
        return weatherDiv;
    }
}
class App {
    placesManager;
    weatherProvider;
    constructor(placesManager, weatherProvider) {
        this.placesManager = placesManager;
        this.weatherProvider = weatherProvider;
    }
    refreshInterval = 1000 * 60 * 5;
    async init() {
        this.clearWeathers();
        const places = this.placesManager.getPlaces();
        for (const place of places) {
            const weather = await this.weatherProvider.getWeather(place);
            if (!weather) {
                continue;
            }
            this.addWeather(weather);
        }
        setTimeout(() => this.init(), this.refreshInterval);
    }
    async getWeather() {
        const cityName = document.getElementById('city-name').value;
        const places = this.placesManager.getPlaces();
        if (places.includes(cityName)) {
            alert('City already added');
            return;
        }
        const weather = await this.weatherProvider.getWeather(cityName);
        if (!weather) {
            alert('Error fetching weather');
            return;
        }
        if (places.length >= 10) {
            this.removeLastWeather();
            this.placesManager.removePlace(places[0]);
        }
        this.placesManager.addPlace(weather.cityName);
        this.addWeather(weather);
    }
    addWeather(weather) {
        const weatherDiv = WeatherRenderer.render(weather, this.placesManager);
        const weathersDiv = document.getElementById('weathers');
        weathersDiv.appendChild(weatherDiv);
    }
    removeLastWeather() {
        const weathersDiv = document.getElementById('weathers');
        weathersDiv.removeChild(weathersDiv.firstChild);
    }
    clearWeathers() {
        const weathersDiv = document.getElementById('weathers');
        weathersDiv.innerHTML = '';
    }
}
const app = new App(new PlacesManager(), new WeatherProvider());
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
const getWeather = async () => {
    app.getWeather();
};
