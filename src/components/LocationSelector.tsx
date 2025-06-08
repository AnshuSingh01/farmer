import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Navigation, 
  ChevronDown,
  Search
} from "lucide-react";

interface LocationSelectorProps {
  onLocationChange: (location: { state: string; district: string }) => void;
  currentLocation: { state: string; district: string };
}

const indianStates = [
  { name: "Karnataka", districts: ["Bangalore", "Mysore", "Mandya", "Kolar", "Tumkur"] },
  { name: "Maharashtra", districts: ["Mumbai", "Pune", "Nashik", "Aurangabad", "Nagpur"] },
  { name: "Tamil Nadu", districts: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"] },
  { name: "Punjab", districts: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"] },
  { name: "Uttar Pradesh", districts: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"] },
  { name: "Gujarat", districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"] },
  { name: "Rajasthan", districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"] },
  { name: "Haryana", districts: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal"] },
];

export function LocationSelector({ onLocationChange, currentLocation }: LocationSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedState, setSelectedState] = useState(currentLocation.state);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = indianStates.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStateSelect = (stateName: string) => {
    setSelectedState(stateName);
    const firstDistrict = indianStates.find(s => s.name === stateName)?.districts[0] || "";
    onLocationChange({ state: stateName, district: firstDistrict });
  };

  const handleDistrictSelect = (district: string) => {
    onLocationChange({ state: selectedState, district });
    setIsExpanded(false);
  };

  const detectLocation = () => {
    // Simulated GPS detection - in real app would use navigator.geolocation
    onLocationChange({ state: "Karnataka", district: "Bangalore" });
    setIsExpanded(false);
  };

  const currentStateData = indianStates.find(s => s.name === currentLocation.state);

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          Farm Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{currentLocation.state}</p>
            <p className="text-sm text-gray-600">{currentLocation.district}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            Change
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <Button
              onClick={detectLocation}
              className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Navigation className="w-4 h-4" />
              Detect My Location
            </Button>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredStates.map((state) => (
                <div key={state.name} className="space-y-1">
                  <button
                    onClick={() => handleStateSelect(state.name)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedState === state.name
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {state.name}
                  </button>
                  {selectedState === state.name && (
                    <div className="ml-4 space-y-1">
                      {state.districts.map((district) => (
                        <button
                          key={district}
                          onClick={() => handleDistrictSelect(district)}
                          className={`w-full text-left p-2 text-sm rounded-lg transition-colors ${
                            currentLocation.district === district
                              ? 'bg-blue-100 text-blue-800 font-medium'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {district}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
