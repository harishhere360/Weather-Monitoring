"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeSummaryForDate = void 0;
const weatherService_1 = require("./weatherService");
const database_1 = require("./database");

// Utility function to convert temperature from Kelvin to Celsius
function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

// Utility function to determine the dominant weather condition based on frequency
function getDominantCondition(conditions) {
    const frequency = {};
    conditions.forEach(condition => {
        frequency[condition] = (frequency[condition] || 0) + 1;
    });
    return Object.keys(frequency).reduce((a, b) => (frequency[a] > frequency[b] ? a : b));
}

// Function to calculate the daily weather summary
function calculateDailySummary(weatherData) {
    let totalTemp = 0;
    let maxTemp = -Infinity;
    let minTemp = Infinity;
    const conditions = [];

    weatherData.forEach(data => {
        const tempCelsius = kelvinToCelsius(data.temp);
        totalTemp += tempCelsius;
        maxTemp = Math.max(maxTemp, tempCelsius);
        minTemp = Math.min(minTemp, tempCelsius);
        conditions.push(data.main);
    });

    return {
        avgTemp: totalTemp / weatherData.length,
        maxTemp,
        minTemp,
        dominantCondition: getDominantCondition(conditions),
    };
}

// Function to store the weather summary for a given date
function storeSummaryForDate(date, weatherData) {
    const summary = calculateDailySummary(weatherData);
    (0, database_1.saveDailySummary)(date, summary);
}
exports.storeSummaryForDate = storeSummaryForDate;

// Temperature threshold for alerts
const TEMP_THRESHOLD = 35;  // Alert if temperature exceeds 35°C

// Function to check if the temperature exceeds the threshold and trigger an alert
function checkThreshold(weatherData) {
    weatherData.forEach(data => {
        const tempCelsius = kelvinToCelsius(data.temp);
        if (tempCelsius > TEMP_THRESHOLD) {
            console.log(`Alert! Temperature in ${data.city} exceeds ${TEMP_THRESHOLD}°C`);
        }
    });
}

// Main function to run weather monitoring
async function runWeatherMonitoring() {
    try {
        const date = new Date().toISOString().split('T')[0];  // Get current date
        const weatherData = await (0, weatherService_1.fetchWeatherForCities)();

        if (weatherData.length > 0) {
            checkThreshold(weatherData);  // Check for temperature thresholds
            storeSummaryForDate(date, weatherData);  // Store the daily summary
            console.log(`Weather data for ${date} processed successfully.`);
        } else {
            console.error("No weather data available.");
        }
    } catch (error) {
        console.error("Error in weather monitoring:", error);
    }
}

// Run the system every 5 minutes
setInterval(runWeatherMonitoring, 300000);  // 5 minutes = 300000 ms

// Initial run
runWeatherMonitoring();
