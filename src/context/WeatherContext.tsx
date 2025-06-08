import React, { createContext, useContext, useState, useEffect } from "react";

const WeatherContext = createContext(null);

export function WeatherProvider({ children, location }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_KEY = "dbbe5c77718300fc14ad3182855ddb6e";
        const city = location.district || "Bangalore";
        const country = "IN";
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${country}&units=metric&appid=${API_KEY}`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},${country}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastRes.json();
        setForecast(forecastData.list || []);
      } catch (err) {
        setError("Failed to fetch live weather data.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [location]);

  return (
    <WeatherContext.Provider value={{ weather, forecast, loading, error }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
} 