
"use strict";
const axios = require('axios');
require('dotenv').config();  // To load the OpenWeatherMap API key from the .env file

// API key from the OpenWeatherMap
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// List of cities for which we will fetch the weather data
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

/**
 * Interface for the weather data returned from OpenWeatherMap API.
 * @typedef {Object} WeatherData
 * @property {string} city - The name of the city.
 * @property {number} temp - The current temperature in Kelvin.
 * @property {number} feels_like - The "feels like" temperature in Kelvin.
 * @property {string} main - The main weather condition (e.g., Rain, Clear, etc.).
 * @property {number} dt - The timestamp of the weather data.
 */

/**
 * Fetches the weather data for a given city from the OpenWeatherMap API.
 * @param {string} city - The name of the city.
 * @returns {Promise<WeatherData|null>} - The weather data or null if there was an error.
 */
async function fetchWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        return {
            city,
            temp: data.main.temp,           // Temperature in Kelvin
            feels_like: data.main.feels_like, // Feels-like temperature in Kelvin
            main: data.weather[0].main,     // Main weather condition (Rain, Clear, etc.)
            dt: data.dt                    // Timestamp of the data
        };
    } catch (error) {
        // Handle error properly, logging the error message if it's an instance of Error
        if (error instanceof Error) {
            console.error(`Error fetching weather for ${city}:`, error.message);
        } else {
            console.error(`Unexpected error fetching weather for ${city}:`, error);
        }
        return null;
    }
}

/**
 * Fetches the weather data for all cities and returns an array of WeatherData.
 * @returns {Promise<WeatherData[]>} - An array of weather data for all the cities.
 */
async function fetchWeatherForCities() {
    const promises = CITIES.map(city => fetchWeather(city));  // Fetch weather data for all cities
    const results = await Promise.all(promises);  // Wait for all API requests to resolve
    return results.filter(result => result !== null);  // Filter out any null results (errors)
}

module.exports = {
    fetchWeatherForCities
};
