import React, { useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw, Bell, Edit2, Droplet, CloudRain, Sun, Info, MapPin, AlertTriangle, Sprout, Plus } from "lucide-react";
import { LocationSelector } from "@/components/LocationSelector";

const borderColor = {
  urgent: "border-red-400",
  info: "border-yellow-400",
  tip: "border-green-400",
};
const iconColor = {
  urgent: "text-red-500",
  info: "text-yellow-500",
  tip: "text-green-500",
};

const defaultLocation = { state: "Karnataka", district: "Bangalore" };

const allLocations = [
  { state: "Karnataka", district: "Bangalore" },
  { state: "Karnataka", district: "Mysore" },
  { state: "Karnataka", district: "Other" }
];

function getWeatherForLocation(location) {
  // Mock: return different weather/alerts for different locations
  if (location.district === "Bangalore") {
    return {
      icon: <CloudRain className="w-8 h-8 text-blue-500" />,
      temp: 28,
      summary: "Heavy Rain Showers",
      alert: {
        type: "urgent",
        message: `Severe rainfall warning for ${location.district}. Secure your fields and delay fertilizer application.`,
      },
    };
  }
  if (location.district === "Mysore") {
    return {
      icon: <Sun className="w-8 h-8 text-yellow-400" />,
      temp: 32,
      summary: "Sunny",
      alert: null,
    };
  }
  return {
    icon: <Sun className="w-8 h-8 text-yellow-400" />,
    temp: 30,
    summary: "Partly Cloudy",
    alert: null,
  };
}

function getFarmAdvice(location) {
  return [
    {
      type: "tip",
      icon: <Sun className="w-6 h-6 text-green-500" />,
      title: `Best Sowing Time in ${location.district}`,
      tip: `For Kharif crops in ${location.district}, start sowing after the first major rainfall for best germination.`,
    },
    {
      type: "info",
      icon: <Droplet className="w-6 h-6 text-blue-500" />,
      title: `Irrigation Advice for ${location.state}`,
      tip: `Monitor soil moisture closely during monsoon breaks in ${location.state}. Use mulching to retain moisture.`,
    },
    {
      type: "tip",
      icon: <Info className="w-6 h-6 text-green-500" />,
      title: `Fertilizer Application` ,
      tip: `Apply nitrogen fertilizer in split doses for rice fields in ${location.district} to maximize yield.`,
    },
  ];
}

const fieldData = [
  {
    name: "Field A",
    crop: "Rice",
    emoji: "🌾",
    area: 2.5,
    health: 92,
    irrigation: "Good",
    irrigationIcon: <Droplet className="w-5 h-5 text-blue-500" />,
  },
  {
    name: "Field B",
    crop: "Wheat",
    emoji: "🌿",
    area: 1.8,
    health: 78,
    irrigation: "Moderate",
    irrigationIcon: <Droplet className="w-5 h-5 text-yellow-500" />,
  },
  {
    name: "Field C",
    crop: "Sugarcane",
    emoji: "🎋",
    area: 3.2,
    health: 58,
    irrigation: "Low",
    irrigationIcon: <Droplet className="w-5 h-5 text-red-500" />,
  },
];

function getProgressColor(score) {
  if (score >= 85) return "bg-green-400";
  if (score >= 60) return "bg-yellow-400";
  return "bg-red-400";
}

// Improved Alerts logic
function getAlerts(location) {
  const now = new Date();
  if (location.district === "Bangalore") {
    return [
      {
        type: "weather",
        severity: "urgent",
        icon: <CloudRain className="w-6 h-6 text-blue-500 animate-bounce" />,
        title: "Heavy Rainfall Warning",
        message: `Severe rainfall expected in ${location.district} in the next 24 hours.`,
        issued: now.toLocaleString(),
        expires: "Tomorrow, 6:00 AM",
        action: "View Weather Details"
      },
      {
        type: "pest",
        severity: "warning",
        icon: <AlertTriangle className="w-6 h-6 text-orange-500 animate-pulse" />,
        title: "Pest Alert: Brown Planthopper",
        message: "High risk detected for rice fields. Inspect and apply recommended pesticide if needed.",
        issued: now.toLocaleString(),
        expires: "In 3 days",
        action: "See Pest Management"
      },
      {
        type: "govt",
        severity: "info",
        icon: <Info className="w-6 h-6 text-yellow-500" />,
        title: "Subsidy Application Deadline",
        message: `Apply for Rahitha Samparka by June 10 in ${location.state}.` ,
        issued: now.toLocaleString(),
        expires: "June 10",
        action: "Apply Now"
      },
      {
        type: "govt",
        severity: "info",
        icon: <Info className="w-6 h-6 text-blue-500" />,
        title: "PM-KISAN Scheme",
        message: "Eligible farmers can register for the PM-KISAN income support scheme. Next installment due July 15.",
        issued: now.toLocaleString(),
        expires: "July 15",
        action: "Register"
      },
      {
        type: "govt",
        severity: "info",
        icon: <Info className="w-6 h-6 text-green-500" />,
        title: "Crop Insurance Enrollment",
        message: "Enroll for Pradhan Mantri Fasal Bima Yojana before July 30 for Kharif crops.",
        issued: now.toLocaleString(),
        expires: "July 30",
        action: "Enroll Now"
      },
      {
        type: "market",
        severity: "info",
        icon: <Sun className="w-6 h-6 text-green-500" />,
        title: "Market Price Drop",
        message: `Maize prices in ${location.district} have dropped by 10% this week.`,
        issued: now.toLocaleString(),
        expires: "End of week",
        action: "View Market Prices"
      }
    ];
  }
  if (location.district === "Mysore") {
    return [
      {
        type: "weather",
        severity: "warning",
        icon: <Sun className="w-6 h-6 text-yellow-400 animate-pulse" />,
        title: "Heatwave Advisory",
        message: `High temperatures expected in ${location.district} for the next 3 days. Irrigate fields early morning.`,
        issued: now.toLocaleString(),
        expires: "In 3 days",
        action: "See Weather Tips"
      },
      {
        type: "govt",
        severity: "info",
        icon: <Info className="w-6 h-6 text-yellow-500" />,
        title: "Crop Insurance Renewal",
        message: `Renew your crop insurance for ${location.district} by June 15.`,
        issued: now.toLocaleString(),
        expires: "June 15",
        action: "Renew Now"
      },
      {
        type: "govt",
        severity: "info",
        icon: <Info className="w-6 h-6 text-blue-500" />,
        title: "Soil Health Card Distribution",
        message: "Collect your updated Soil Health Card from the local Krishi Vigyan Kendra.",
        issued: now.toLocaleString(),
        expires: "July 5",
        action: "Collect Card"
      },
      {
        type: "govt",
        severity: "info",
        icon: <Info className="w-6 h-6 text-green-500" />,
        title: "Organic Farming Subsidy",
        message: "Apply for the state organic farming subsidy by August 1.",
        issued: now.toLocaleString(),
        expires: "August 1",
        action: "Apply Now"
      },
      {
        type: "market",
        severity: "info",
        icon: <Sun className="w-6 h-6 text-green-500" />,
        title: "Market Price Surge",
        message: `Wheat prices in ${location.district} have increased by 8% this week.`,
        issued: now.toLocaleString(),
        expires: "End of week",
        action: "View Market Prices"
      }
    ];
  }
  // Generic alerts for all other locations
  return [
    {
      type: "weather",
      severity: "warning",
      icon: <CloudRain className="w-6 h-6 text-blue-400 animate-pulse" />,
      title: "Monsoon Onset Alert",
      message: `Monsoon expected to reach ${location.district} in the next 5 days. Prepare fields for sowing.`,
      issued: now.toLocaleString(),
      expires: "In 5 days",
      action: "See Preparation Tips"
    },
    {
      type: "govt",
      severity: "info",
      icon: <Info className="w-6 h-6 text-yellow-500" />,
      title: "Fertilizer Subsidy Reminder",
      message: `Apply for fertilizer subsidy in ${location.state} by June 20.`,
      issued: now.toLocaleString(),
      expires: "June 20",
      action: "Apply Now"
    },
    {
      type: "govt",
      severity: "info",
      icon: <Info className="w-6 h-6 text-blue-500" />,
      title: "PM-KISAN Installment",
      message: "Next PM-KISAN installment for eligible farmers will be credited on July 15.",
      issued: now.toLocaleString(),
      expires: "July 15",
      action: "Check Status"
    },
    {
      type: "govt",
      severity: "info",
      icon: <Info className="w-6 h-6 text-green-500" />,
      title: "Farm Mechanization Grant",
      message: "Apply for farm equipment grant by August 10 at your local agriculture office.",
      issued: now.toLocaleString(),
      expires: "August 10",
      action: "Apply Now"
    },
    {
      type: "market",
      severity: "info",
      icon: <Sun className="w-6 h-6 text-green-500" />,
      title: "Market Price Update",
      message: `Check latest prices for rice and maize in ${location.district}.`,
      issued: now.toLocaleString(),
      expires: "End of week",
      action: "View Market Prices"
    }
  ];
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null);
  const [location, setLocation] = useState(defaultLocation);
  const todayWeather = getWeatherForLocation(location);
  const farmAdvice = getFarmAdvice(location);
  const alerts = getAlerts(location);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-200 py-10 overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 w-[80vw] h-[40vh] bg-green-200 opacity-30 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[30vh] bg-blue-200 opacity-20 rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-12">
        {/* Location Selector */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <LocationSelector currentLocation={location} onLocationChange={setLocation} />
          </div>
        </div>

        {/* Weather Alert */}
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow-sm">
            <CloudRain className="w-7 h-7 text-blue-400" /> Weather Alert
          </h2>
          <div className={`rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-green-50 border-l-8 ${todayWeather.alert ? (todayWeather.alert.type === 'urgent' ? 'border-red-400' : 'border-yellow-400') : 'border-blue-400'} p-6 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-300`}>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-green-700" />
              <span className="font-semibold text-lg text-green-900">{location.district}, {location.state}</span>
            </div>
            <div className="flex items-center gap-3 ml-0 md:ml-8">
              {todayWeather.icon}
              <span className="text-2xl font-bold text-blue-700 drop-shadow-sm">{todayWeather.temp}°C</span>
              <span className="text-gray-700 font-medium">{todayWeather.summary}</span>
            </div>
            {todayWeather.alert && (
              <div className={`flex items-center gap-2 ml-0 md:ml-auto px-3 py-2 rounded-xl ${todayWeather.alert.type === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'} font-semibold shadow-sm`}>
                <AlertTriangle className="w-5 h-5" />
                <span>{todayWeather.alert.message}</span>
              </div>
            )}
          </div>
        </section>

        {/* Farm Advice & Tips */}
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-3 text-green-900 tracking-tight drop-shadow-sm">
            <Info className="w-7 h-7 text-green-400" /> Farm Advice & Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {farmAdvice.map((advice, idx) => (
              <div
                key={idx}
                className={`rounded-2xl shadow-lg bg-gradient-to-br from-green-50 to-white border-l-8 ${advice.type === 'tip' ? 'border-green-400' : 'border-yellow-400'} p-6 flex flex-col transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {advice.icon}
                  <span className="font-semibold text-lg">{advice.title}</span>
                </div>
                <div className="text-gray-700 font-medium">{advice.tip}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Alerts Section (improved) */}
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-3 text-red-900 tracking-tight drop-shadow-sm">
            <AlertTriangle className="w-7 h-7 text-red-400" /> Alerts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`rounded-2xl shadow-lg bg-white border-l-8 ${alert.severity === 'urgent' ? 'border-red-500' : alert.severity === 'warning' ? 'border-orange-400' : 'border-yellow-400'} p-6 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
              >
                <div className="flex items-center gap-3 mb-1">
                  {alert.icon}
                  <span className="font-semibold text-lg">{alert.title}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-xs font-bold ${alert.severity === 'urgent' ? 'bg-red-100 text-red-700 animate-pulse' : alert.severity === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {alert.severity ? alert.severity.toUpperCase() : ''}
                  </span>
                </div>
                <div className="text-gray-700 font-medium">{alert.message}</div>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <span>Issued: {alert.issued}</span>
                  {alert.expires && <span>• Expires: {alert.expires}</span>}
                </div>
                {alert.action && (
                  <button className="mt-2 self-start px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition">
                    {alert.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Government Policies */}
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow-sm">
            <Info className="w-7 h-7 text-blue-400" /> Government Policies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getAlerts(location).filter(a => a.type === "govt").map((policy, idx) => (
              <div
                key={idx}
                className="rounded-2xl shadow-lg bg-white border-l-8 border-blue-400 p-6 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-1">
                  {policy.icon}
                  <span className="font-semibold text-lg">{policy.title}</span>
                </div>
                <div className="text-gray-700 font-medium">{policy.message}</div>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <span>Issued: {policy.issued}</span>
                  {policy.expires && <span>• Expires: {policy.expires}</span>}
                </div>
                {policy.action && (
                  <button className="mt-2 self-start px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition">
                    {policy.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-green-400 to-blue-400 text-white rounded-full shadow-2xl p-5 hover:scale-110 hover:shadow-emerald-400/40 transition-all flex items-center gap-2 text-lg font-bold">
        <Plus className="w-6 h-6" /> Quick Add
      </button>
    </div>
  );
}

// Add this to your global CSS for smooth fade-in:
// .animate-fade-in { animation: fadeIn 0.4s ease; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
