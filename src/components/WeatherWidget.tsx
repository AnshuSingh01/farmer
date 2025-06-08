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
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

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
          title: `Monsoon Preparation in ${location.district}`,
          advice: `Southwest monsoon arriving soon in ${location.district}, ${location.state}. Prepare rice fields for transplanting and check bunds for leaks.`,
          priority: "high",
        },
        {
          title: `Coffee Belt Weather in ${location.district}`,
          advice: `Ideal weather conditions for coffee plantations in ${location.district}. Monitor for coffee berry borer after rains.`,
          priority: "low",
        },
        {
          title: `Pest Management in ${location.district}`,
          advice: `Scout for stem borer and leaf folder in paddy fields. Use pheromone traps and avoid overuse of pesticides.`,
          priority: "medium",
        },
        {
          title: `Irrigation Tips for ${location.district}`,
          advice: `Irrigate early morning or late evening to reduce evaporation losses. Use mulching to retain soil moisture in ${location.district}.`,
          priority: "medium",
        },
        {
          title: `Government Schemes in ${location.state}`,
          advice: `Check eligibility for PM-KISAN and Fasal Bima Yojana in ${location.district}. Visit the local agriculture office for assistance.`,
          priority: "info",
        },
        {
          title: `Soil Health in ${location.district}`,
          advice: `Collect soil samples for testing before sowing. Apply recommended fertilizers based on soil test results for ${location.district}.`,
          priority: "medium",
        },
        {
          title: `Crop Selection Advice for ${location.district}`,
          advice: `For the current season, consider short-duration paddy or pulses if monsoon onset is delayed in ${location.district}.`,
          priority: "tip",
        },
      ],
      "Punjab": [
        {
          title: `Wheat Season Alert in ${location.district}`,
          advice: `Temperature dropping - monitor wheat crops for frost damage in northern districts like ${location.district}. Use light irrigation to protect crops from frost.`,
          priority: "high",
        },
        {
          title: `Irrigation Advisory for ${location.district}`,
          advice: `Groundwater levels optimal for rice cultivation this season in ${location.district}. Avoid over-irrigation to prevent waterlogging.`,
          priority: "medium",
        },
        {
          title: `Pest & Disease Watch in ${location.district}`,
          advice: `Scout for yellow rust in wheat. Apply fungicide only if symptoms appear. Rotate crops to reduce pest pressure in ${location.district}.`,
          priority: "medium",
        },
        {
          title: `Government Subsidies in ${location.state}`,
          advice: `Apply for fertilizer and seed subsidies available for ${location.state}. Contact the local Krishi Vigyan Kendra in ${location.district}.`,
          priority: "info",
        },
        {
          title: `Soil Health Card in ${location.district}`,
          advice: `Collect your updated Soil Health Card from the local office in ${location.district}. Follow recommendations for balanced fertilization.`,
          priority: "medium",
        },
        {
          title: `Crop Diversification in ${location.district}`,
          advice: `Consider maize or pulses as alternative crops to improve soil health and income in ${location.district}.`,
          priority: "tip",
        },
      ],
      // Add more states and default
      "default": [
        {
          title: `General Sowing Advice for ${location.district}`,
          advice: `Start sowing after the first major rainfall in ${location.district}, ${location.state} for best germination.`,
          priority: "high",
        },
        {
          title: `Irrigation Management in ${location.district}`,
          advice: `Monitor soil moisture closely and irrigate as needed. Use mulching to retain moisture in ${location.district}.`,
          priority: "medium",
        },
        {
          title: `Pest & Disease Monitoring in ${location.district}`,
          advice: `Regularly inspect crops for pests and diseases. Use integrated pest management practices in ${location.district}.`,
          priority: "medium",
        },
        {
          title: `Government Schemes in ${location.state}`,
          advice: `Check eligibility for central and state government schemes in ${location.state}. Contact your local agriculture office in ${location.district}.`,
          priority: "info",
        },
        {
          title: `Soil Testing in ${location.district}`,
          advice: `Test your soil before sowing and follow fertilizer recommendations for ${location.district}.`,
          priority: "medium",
        },
        {
          title: `Crop Rotation in ${location.district}`,
          advice: `Practice crop rotation to improve soil fertility and reduce pest pressure in ${location.district}.`,
          priority: "tip",
        },
      ],
    };
    return regionAdvice[location.state] || regionAdvice["default"];
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

  // --- Weather Alerts (API or custom) ---
  let weatherAlerts: { title: string; message: string; severity: string }[] = [];
  if (weather && weather.alerts && Array.isArray(weather.alerts)) {
    weatherAlerts = weather.alerts.map((a: any) => ({
      title: a.event || "Weather Alert",
      message: a.description || "See details.",
      severity: a.severity || "info"
    }));
  } else {
    // Custom alerts based on real data
    if (displayWeather.temperature >= 38) {
      weatherAlerts.push({
        title: "Heatwave Warning",
        message: "Extreme heat detected. Irrigate early and protect crops and workers from heat stress.",
        severity: "danger"
      });
    }
    if (displayWeather.windSpeed >= 30) {
      weatherAlerts.push({
        title: "High Wind Warning",
        message: "Strong winds expected. Secure loose items and protect young plants.",
        severity: "warning"
      });
    }
    if (displayWeather.condition.toLowerCase().includes("rain")) {
      weatherAlerts.push({
        title: "Heavy Rain Alert",
        message: "Rainy conditions. Delay fertilizer/pesticide application and check drainage.",
        severity: "info"
      });
    }
  }

  // --- Actionable Suggestions ---
  const actionableSuggestions: string[] = [];
  if (displayWeather.temperature >= 35) actionableSuggestions.push("Consider mulching and irrigating in the early morning or late evening to reduce heat stress on crops.");
  if (displayWeather.humidity >= 80) actionableSuggestions.push("Monitor for fungal diseases due to high humidity. Ensure good air circulation in fields.");
  if (displayWeather.windSpeed >= 25) actionableSuggestions.push("Avoid spraying pesticides during high winds to prevent drift and waste.");
  if (displayWeather.condition.toLowerCase().includes("rain")) actionableSuggestions.push("Check field drainage and avoid machinery use on wet soil.");
  if (displayWeather.temperature <= 10) actionableSuggestions.push("Protect sensitive crops from cold. Consider using covers or mulching.");

  // --- Extreme Conditions Highlight ---
  let extremeCondition: string | null = null;
  if (displayWeather.temperature >= 40) extremeCondition = "⚠️ Extreme heat! Take urgent action to protect crops and workers.";
  if (displayWeather.temperature <= 5) extremeCondition = "⚠️ Extreme cold! Protect crops from frost.";
  if (displayWeather.windSpeed >= 40) extremeCondition = "⚠️ Dangerous wind speeds! Secure all farm equipment.";

  // State for interactivity
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedAdvice, setExpandedAdvice] = useState<number | null>(null);

  return (
    <div className="space-y-6">
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
      {/* Extreme Condition Banner */}
      {extremeCondition && (
        <Card
          className={`border-l-8 border-red-400 bg-red-50 cursor-pointer ${expandedSection === 'extreme' ? 'ring-2 ring-red-400' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'extreme' ? null : 'extreme')}
        >
          <CardContent>
            <div className="text-red-800 font-bold text-lg flex items-center gap-2">{extremeCondition}</div>
            {expandedSection === 'extreme' && (
              <div className="mt-2 text-red-700 text-sm">Extreme weather can cause crop loss and health risks. Take all recommended precautions and monitor updates from local authorities.</div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Card
          className={`border-l-8 border-blue-400 cursor-pointer ${expandedSection === 'alerts' ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'alerts' ? null : 'alerts')}
        >
          <CardHeader><CardTitle>Weather Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {weatherAlerts.map((alert, idx) => (
              <div key={idx} className={`p-3 rounded-lg flex items-center gap-3 shadow border-l-4 ${alert.severity === 'danger' ? 'border-red-500 bg-red-50' : alert.severity === 'warning' ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400 bg-blue-50'}`}>
                <span className="font-semibold">{alert.title}:</span>
                <span>{alert.message}</span>
              </div>
            ))}
            {expandedSection === 'alerts' && (
              <div className="mt-2 text-blue-700 text-sm">For more details, visit the IMD website or your local weather office. Stay updated for new alerts.</div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Actionable Suggestions */}
      {actionableSuggestions.length > 0 && (
        <Card
          className={`border-l-8 border-green-400 cursor-pointer ${expandedSection === 'suggestions' ? 'ring-2 ring-green-400' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'suggestions' ? null : 'suggestions')}
        >
          <CardHeader><CardTitle>Suggestions for Current Conditions</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {actionableSuggestions.map((s, idx) => (
              <div key={idx} className="text-green-900 text-sm flex items-center gap-2">• {s}</div>
            ))}
            {expandedSection === 'suggestions' && (
              <div className="mt-2 text-green-700 text-sm">These suggestions are based on real-time weather data for your location. For more personalized advice, consult your local extension officer.</div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Regional Farming Recommendations */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Regional Farming Recommendations</CardTitle>
          <CardDescription>Weather-based advice for {location.state}, {location.district}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {locationFarmingAdvice.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border cursor-pointer ${getPriorityColor(item.priority)} ${expandedAdvice === index ? 'ring-2 ring-green-400' : ''}`}
              onClick={() => setExpandedAdvice(expandedAdvice === index ? null : index)}
            >
              <h4 className="font-semibold text-gray-900 mb-2">{item.title.replace(location.state, `${location.state}, ${location.district}`)}</h4>
              <p className="text-sm text-gray-700">{item.advice.replace(location.state, `${location.state}, ${location.district}`).replace(location.district, location.district)}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                item.priority === 'high' ? 'bg-red-100 text-red-800' :
                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
              </span>
              {expandedAdvice === index && (
                <div className="mt-2 text-green-700 text-sm">
                  For more details, contact your local agriculture extension officer or visit the nearest Krishi Vigyan Kendra in {location.district}. You can also join local WhatsApp groups for real-time farming tips.
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
