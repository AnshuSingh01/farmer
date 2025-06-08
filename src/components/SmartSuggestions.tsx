
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Droplets,
  Sun,
  DollarSign
} from "lucide-react";

interface SmartSuggestionsProps {
  location: { state: string; district: string };
  currentView: string;
}

export function SmartSuggestions({ location, currentView }: SmartSuggestionsProps) {
  const getLocationSpecificSuggestions = () => {
    const stateData: Record<string, any> = {
      "Karnataka": {
        crops: ["Rice", "Sugarcane", "Cotton", "Ragi"],
        season: "Kharif season starting - prepare for monsoon crops",
        diseases: ["Blast in rice", "Red rot in sugarcane"],
        markets: ["Bangalore APMC", "Mysore Mandi"],
        schemes: ["Raitha Samparka", "Krishi Bhagya"],
      },
      "Punjab": {
        crops: ["Wheat", "Rice", "Maize", "Cotton"],
        season: "Wheat harvesting season - monitor grain moisture",
        diseases: ["Yellow rust in wheat", "Stem borer in rice"],
        markets: ["Ludhiana Grain Market", "Amritsar Mandi"],
        schemes: ["Punjab Crop Diversification", "Pani Bachao Paisa Kamao"],
      },
      "Maharashtra": {
        crops: ["Cotton", "Sugarcane", "Soybean", "Onion"],
        season: "Cotton sowing season - ensure adequate irrigation",
        diseases: ["Pink bollworm", "Thrips in cotton"],
        markets: ["Mumbai APMC", "Pune Agricultural Market"],
        schemes: ["Jalyukt Shivar", "Magel Tyala Shet Tala"],
      },
    };

    return stateData[location.state] || stateData["Karnataka"];
  };

  const getViewSpecificSuggestions = () => {
    const data = getLocationSpecificSuggestions();
    
    switch (currentView) {
      case 'weather':
        return [
          {
            title: "Monsoon Preparation",
            description: `In ${location.district}, prepare for upcoming rains. Check drainage systems.`,
            icon: Droplets,
            priority: "high",
            action: "Prepare drainage"
          },
          {
            title: "UV Protection",
            description: "High UV levels expected. Protect sensitive crops with shade nets.",
            icon: Sun,
            priority: "medium",
            action: "Install shade nets"
          }
        ];
      
      case 'crop-health':
        return [
          {
            title: "Disease Alert",
            description: `${data.diseases[0]} commonly affects crops in ${location.state}`,
            icon: AlertTriangle,
            priority: "high",
            action: "Apply preventive spray"
          },
          {
            title: "Growth Monitoring",
            description: "Optimal growth phase for your region's main crops.",
            icon: TrendingUp,
            priority: "medium",
            action: "Monitor daily"
          }
        ];
      
      case 'market-prices':
        return [
          {
            title: "Best Selling Window",
            description: `${data.markets[0]} showing good prices for ${data.crops[0]}`,
            icon: DollarSign,
            priority: "high",
            action: "Sell now"
          },
          {
            title: "Market Trend",
            description: "Price uptrend expected for regional crops next week.",
            icon: TrendingUp,
            priority: "medium",
            action: "Hold for better prices"
          }
        ];
      
      default:
        return [
          {
            title: "Seasonal Advice",
            description: data.season,
            icon: Calendar,
            priority: "high",
            action: "Plan accordingly"
          },
          {
            title: "Regional Scheme",
            description: `Apply for ${data.schemes[0]} - deadline approaching`,
            icon: Lightbulb,
            priority: "medium",
            action: "Apply now"
          }
        ];
    }
  };

  const suggestions = getViewSpecificSuggestions();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50 text-red-800";
      case "medium": return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "low": return "border-green-200 bg-green-50 text-green-800";
      default: return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          Smart Suggestions for {location.state}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}>
            <div className="flex items-start gap-3">
              <suggestion.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                <p className="text-xs mb-2 opacity-90">{suggestion.description}</p>
                <span className="inline-block px-2 py-1 bg-white/50 rounded-full text-xs font-medium">
                  {suggestion.action}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
