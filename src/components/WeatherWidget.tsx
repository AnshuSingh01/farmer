import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationSelector } from "@/components/LocationSelector";
import { SmartSuggestions } from "@/components/SmartSuggestions";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Eye, 
  Thermometer,
  Droplets,
  Gauge
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWeather } from "../context/WeatherContext";

interface WeatherWidgetProps {
  location?: { state: string; district: string };
  onLocationChange?: (location: { state: string; district: string }) => void;
}

export function WeatherWidget({ location = { state: "Karnataka", district: "Bangalore" }, onLocationChange }: WeatherWidgetProps) {
  const { weather, forecast, loading, error } = useWeather();

  const currentWeather = {
    location: "Karnataka, India",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    uvIndex: 6,
  };

  // Fallback static forecast if context forecast is empty
  const staticForecast = [
    { day: "Today", high: 30, low: 22, condition: "Partly Cloudy", icon: Cloud },
    { day: "Tomorrow", high: 32, low: 24, condition: "Sunny", icon: Sun },
    { day: "Saturday", high: 29, low: 21, condition: "Light Rain", icon: CloudRain },
    { day: "Sunday", high: 27, low: 20, condition: "Cloudy", icon: Cloud },
    { day: "Monday", high: 31, low: 23, condition: "Sunny", icon: Sun },
    { day: "Tuesday", high: 26, low: 19, condition: "Rainy", icon: CloudRain },
  ];

  // Enhanced farming advice based on location
  const getLocationSpecificAdvice = () => {
    const regionAdvice: Record<string, any[]> = {
      "Karnataka": [
        {
          title: "Monsoon Preparation",
          advice: "Southwest monsoon arriving soon in Karnataka. Prepare rice fields for transplanting.",
          priority: "high",
        },
        {
          title: "Coffee Belt Weather",
          advice: "Ideal weather conditions for coffee plantations in Chikmagalur region.",
          priority: "low",
        }
      ],
      "Punjab": [
        {
          title: "Wheat Season Alert",
          advice: "Temperature dropping - monitor wheat crops for frost damage in northern districts.",
          priority: "high",
        },
        {
          title: "Irrigation Advisory",
          advice: "Groundwater levels optimal for rice cultivation this season.",
          priority: "medium",
        }
      ]
    };

    return regionAdvice[location.state] || regionAdvice["Karnataka"];
  };

  const locationFarmingAdvice = getLocationSpecificAdvice();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50";
      case "medium": return "border-yellow-200 bg-yellow-50";
      case "low": return "border-green-200 bg-green-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  // Use liveWeather if available
  const displayWeather = weather && weather.main ? {
    location: `${weather.name}, ${weather.sys?.country || "IN"}`,
    temperature: Math.round(weather.main.temp),
    condition: weather.weather?.[0]?.main || "-",
    humidity: weather.main.humidity,
    windSpeed: weather.wind.speed,
    visibility: weather.visibility ? Math.round(weather.visibility / 1000) : '-',
    pressure: weather.main.pressure,
    uvIndex: '-', // OpenWeather free API does not provide UV index
  } : currentWeather;

  // Use liveForecast if available
  const displayForecast = forecast && forecast.length > 0
    ? forecast.filter((_, i) => i % 8 === 0).slice(0, 5).map((item, idx) => ({
        day: idx === 0 ? "Today" : new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'long' }),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather?.[0]?.main || "-",
        icon: Cloud, // You can map OpenWeather icon codes to your icons for more detail
      }))
    : staticForecast;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>
          <p className="text-gray-600 mt-2">Real-time weather data for {location.state}, {location.district}</p>
        </div>
      </div>
      {loading && <div className="text-blue-600">Loading live weather data...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {/* Location and Suggestions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {onLocationChange && (
          <LocationSelector 
            currentLocation={location}
            onLocationChange={onLocationChange}
          />
        )}
        <SmartSuggestions 
          location={location}
          currentView="weather"
        />
      </div>
      {/* Current Weather */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Current Weather</CardTitle>
          <CardDescription className="text-blue-100">{displayWeather.location}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold">{displayWeather.temperature}°C</div>
              <div>
                <p className="text-lg font-medium">{displayWeather.condition}</p>
                <p className="text-blue-100">Feels like {displayWeather.temperature + 2}°C</p>
              </div>
            </div>
            <Cloud className="w-16 h-16 text-blue-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-400">
            <div className="text-center">
              <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-sm text-blue-100">Humidity</p>
              <p className="font-semibold">{displayWeather.humidity}%</p>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-sm text-blue-100">Wind Speed</p>
              <p className="font-semibold">{displayWeather.windSpeed} km/h</p>
            </div>
            <div className="text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-sm text-blue-100">Visibility</p>
              <p className="font-semibold">{displayWeather.visibility} km</p>
            </div>
            <div className="text-center">
              <Gauge className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-sm text-blue-100">Pressure</p>
              <p className="font-semibold">{displayWeather.pressure} hPa</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5-Day Forecast */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
            <CardDescription>Weather outlook for the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayForecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <day.icon className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{day.day}</p>
                    <p className="text-sm text-gray-500">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{day.high}°C</p>
                  <p className="text-sm text-gray-500">{day.low}°C</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Enhanced Farming Recommendations */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Regional Farming Recommendations</CardTitle>
            <CardDescription>Weather-based advice for {location.state}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {locationFarmingAdvice.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(item.priority)}`}>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-700">{item.advice}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
