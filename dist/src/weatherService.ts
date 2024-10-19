import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

export interface WeatherData {
    city: string;
    temp: number;
    feels_like: number;
    main: string;
    dt: number;
}

export async function fetchWeather(city: string): Promise<WeatherData | null> {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;
        return {
            city,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            main: data.weather[0].main,
            dt: data.dt
        };
    } catch (error) {
        // TypeScript sees `error` as `unknown` by default, so we need to assert it as an `Error`
        if (error instanceof Error) {
            console.error(`Error fetching weather for ${city}:`, error.message);
        } else {
            console.error(`Unexpected error fetching weather for ${city}:`, error);
        }
        return null;
    }
}

export async function fetchWeatherForCities(): Promise<WeatherData[]> {
    const promises = CITIES.map(city => fetchWeather(city));
    const results = await Promise.all(promises);
    return results.filter(result => result !== null) as WeatherData[];
}

