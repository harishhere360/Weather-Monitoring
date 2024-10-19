// Import services and necessary types
import { fetchWeatherForCities, WeatherData } from './weatherService';
import { saveDailySummary, DailySummary } from './database';

// Utility function to convert temperature from Kelvin to Celsius
function kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
}

// Utility function to determine the dominant weather condition based on frequency
function getDominantCondition(conditions: string[]): string {
    const frequency: { [key: string]: number } = {};
    conditions.forEach(condition => {
        frequency[condition] = (frequency[condition] || 0) + 1;
    });
    return Object.keys(frequency).reduce((a, b) => (frequency[a] > frequency[b] ? a : b));
}

// Function to calculate the daily weather summary
function calculateDailySummary(weatherData: WeatherData[]): DailySummary {
    let totalTemp = 0;
    let maxTemp = -Infinity;
    let minTemp = Infinity;
    const conditions: string[] = [];

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
export function storeSummaryForDate(date: string, weatherData: WeatherData[]) {
    const summary = calculateDailySummary(weatherData);
    saveDailySummary(date, summary);
}

// Temperature threshold for alerts
const TEMP_THRESHOLD = 35;  // Alert if temperature exceeds 35°C

// Function to check if the temperature exceeds the threshold and trigger an alert
function checkThreshold(weatherData: WeatherData[]): void {
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
        const weatherData = await fetchWeatherForCities();

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
