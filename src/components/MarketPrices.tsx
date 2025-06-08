import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Calendar,
  MapPin
} from "lucide-react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MarketPricesProps {
  location: { state: string; district: string };
  onLocationChange: (location: { state: string; district: string }) => void;
}

export function MarketPrices({ location, onLocationChange }: MarketPricesProps) {
  const cropPrices = [
    {
      crop: "Rice",
      currentPrice: 2150,
      previousPrice: 2080,
      unit: "₹/quintal",
      change: 3.4,
      trend: "up",
      market: "Bangalore",
    },
    {
      crop: "Wheat",
      currentPrice: 2250,
      previousPrice: 2300,
      unit: "₹/quintal",
      change: -2.2,
      trend: "down",
      market: "Mysore",
    },
    {
      crop: "Sugarcane",
      currentPrice: 280,
      previousPrice: 275,
      unit: "₹/quintal",
      change: 1.8,
      trend: "up",
      market: "Mandya",
    },
    {
      crop: "Cotton",
      currentPrice: 5500,
      previousPrice: 5400,
      unit: "₹/quintal",
      change: 1.9,
      trend: "up",
      market: "Raichur",
    },
    {
      crop: "Maize",
      currentPrice: 1950,
      previousPrice: 1980,
      unit: "₹/quintal",
      change: -1.5,
      trend: "down",
      market: "Bangalore",
    },
    {
      crop: "Tomato",
      currentPrice: 25,
      previousPrice: 30,
      unit: "₹/kg",
      change: -16.7,
      trend: "down",
      market: "Kolar",
    },
  ];

  const marketTrends = [
    {
      period: "Today",
      totalTrades: 145,
      avgPrice: "₹2,180",
      volume: "2,850 quintals",
    },
    {
      period: "This Week",
      totalTrades: 892,
      avgPrice: "₹2,165",
      volume: "18,500 quintals",
    },
    {
      period: "This Month",
      totalTrades: 3456,
      avgPrice: "₹2,142",
      volume: "89,200 quintals",
    },
  ];

  const priceAlerts = [
    {
      crop: "Rice",
      message: "Price increased by 3.4% - Good time to sell",
      type: "positive",
      time: "2 hours ago",
    },
    {
      crop: "Tomato",
      message: "Price dropped significantly - Hold if possible",
      type: "negative", 
      time: "4 hours ago",
    },
    {
      crop: "Cotton",
      message: "Steady upward trend - Monitor for best selling price",
      type: "neutral",
      time: "1 day ago",
    },
  ];

  // Mock historical price data for each crop
  const priceHistory = {
    Rice: [
      { date: '2024-05-01', price: 2050 },
      { date: '2024-05-08', price: 2080 },
      { date: '2024-05-15', price: 2100 },
      { date: '2024-05-22', price: 2120 },
      { date: '2024-05-29', price: 2150 },
    ],
    Wheat: [
      { date: '2024-05-01', price: 2280 },
      { date: '2024-05-08', price: 2300 },
      { date: '2024-05-15', price: 2290 },
      { date: '2024-05-22', price: 2270 },
      { date: '2024-05-29', price: 2250 },
    ],
    Sugarcane: [
      { date: '2024-05-01', price: 270 },
      { date: '2024-05-08', price: 272 },
      { date: '2024-05-15', price: 275 },
      { date: '2024-05-22', price: 278 },
      { date: '2024-05-29', price: 280 },
    ],
    Cotton: [
      { date: '2024-05-01', price: 5300 },
      { date: '2024-05-08', price: 5350 },
      { date: '2024-05-15', price: 5400 },
      { date: '2024-05-22', price: 5450 },
      { date: '2024-05-29', price: 5500 },
    ],
    Maize: [
      { date: '2024-05-01', price: 2000 },
      { date: '2024-05-08', price: 1980 },
      { date: '2024-05-15', price: 1970 },
      { date: '2024-05-22', price: 1960 },
      { date: '2024-05-29', price: 1950 },
    ],
    Tomato: [
      { date: '2024-05-01', price: 35 },
      { date: '2024-05-08', price: 32 },
      { date: '2024-05-15', price: 30 },
      { date: '2024-05-22', price: 28 },
      { date: '2024-05-29', price: 25 },
    ],
  };

  const cropOptions = Object.keys(priceHistory);
  const [selectedCrop, setSelectedCrop] = useState(cropOptions[0]);
  const [loading, setLoading] = useState(false);

  // Calculate min, max, avg for the selected crop
  const prices = priceHistory[selectedCrop].map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  const chartData: ChartData<'bar'> = {
    labels: priceHistory[selectedCrop].map((d) => d.date),
    datasets: [
      {
        label: `${selectedCrop} Price (₹)`,
        data: prices,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
      {
        label: 'Avg Price',
        data: prices.map(() => avgPrice),
        backgroundColor: '#f59e42',
        borderRadius: 0,
        barPercentage: 0.1,
        categoryPercentage: 0.1,
        type: 'bar' as const,
      }
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: `${selectedCrop} Price Trend (Last 5 Weeks)` },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) label += `₹${context.parsed.y}`;
            return label;
          }
        }
      },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Price (₹)' } },
    },
  };

  // Crop images/icons (mock)
  const cropIcons = {
    Rice: '🍚',
    Wheat: '🌾',
    Sugarcane: '🥤',
    Cotton: '🧵',
    Maize: '🌽',
    Tomato: '🍅',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Prices</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {location.state} Markets • Live Prices
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Crop Selector and Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 mb-1">Select Crop</label>
            <select
              id="crop-select"
              value={selectedCrop}
              onChange={e => {
                setLoading(true);
                setTimeout(() => {
                  setSelectedCrop(e.target.value);
                  setLoading(false);
                }, 300);
              }}
              className="border rounded-md px-3 py-2"
            >
              {cropOptions.map(crop => (
                <option key={crop} value={crop}>{cropIcons[crop]} {crop}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="bg-green-50 rounded px-3 py-1 text-green-700 text-xs font-semibold">Min: ₹{minPrice}</div>
            <div className="bg-orange-50 rounded px-3 py-1 text-orange-700 text-xs font-semibold">Avg: ₹{avgPrice}</div>
            <div className="bg-red-50 rounded px-3 py-1 text-red-700 text-xs font-semibold">Max: ₹{maxPrice}</div>
          </div>
        </div>
        <div className="w-full max-w-2xl mx-auto min-h-[320px] flex items-center justify-center">
          {loading ? (
            <div className="text-gray-400 text-lg">Loading chart...</div>
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Current Prices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cropPrices.map((item, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">{item.crop}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.market}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.currentPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-500">{item.unit}</div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                  item.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(item.change)}%
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Previous: ₹{item.previousPrice.toLocaleString('en-IN')} {item.unit.split('/')[1]}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Overview */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Market Overview
            </CardTitle>
            <CardDescription>Trading statistics and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketTrends.map((trend, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">{trend.period}</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Trades</p>
                    <p className="font-semibold text-gray-900">{trend.totalTrades}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Price</p>
                    <p className="font-semibold text-gray-900">{trend.avgPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="font-semibold text-gray-900">{trend.volume}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price Alerts */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Price Alerts
            </CardTitle>
            <CardDescription>Recent price movements and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {priceAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                alert.type === 'positive' ? 'border-green-200 bg-green-50' :
                alert.type === 'negative' ? 'border-red-200 bg-red-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{alert.crop}</h4>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Best Selling Opportunities */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Best Selling Opportunities</CardTitle>
          <CardDescription>Crops with favorable market conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { crop: "Rice", reason: "Price up 3.4%, high demand", urgency: "Sell Now" },
              { crop: "Cotton", reason: "Steady upward trend continues", urgency: "Monitor" },
              { crop: "Sugarcane", reason: "Seasonal price increase expected", urgency: "Hold" },
            ].map((opportunity, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-2">{opportunity.crop}</h4>
                <p className="text-sm text-gray-600 mb-3">{opportunity.reason}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  opportunity.urgency === 'Sell Now' ? 'bg-green-100 text-green-800' :
                  opportunity.urgency === 'Monitor' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {opportunity.urgency}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
