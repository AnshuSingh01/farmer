import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sprout, Leaf, Flower, Nut, Wheat, CheckCircle, Apple } from "lucide-react";

const indianStates = [
  "Karnataka", "Maharashtra", "Tamil Nadu", "Punjab", "Uttar Pradesh", "Gujarat", "Rajasthan", "Haryana"
];
const cropSeasons = ["Rabi", "Kharif", "Zaid"];
const irrigationTypes = ["Rainfed", "Canal", "Drip", "Borewell"];

interface Phase {
  name: string;
  weeks: number;
  tips: string[];
  tasks: string[];
  risks: string[];
  inputs: string[];
  weather: {
    optimal: string;
    avoid: string;
  };
  progress: number;
  icon: React.ElementType;
  start?: Date;
  end?: Date;
}

interface Crop {
  name: string;
  seasons: string[];
  states: string[];
  yield: number;
  price: number;
  demand: number;
  water: string;
  soil: string;
  temperature: { min: number; max: number };
  rainfall: { min: number; max: number };
  duration: number;
  successRate: number;
  marketStability: number;
  regionalPreference: number;
  pestResistance: number;
  diseaseResistance: number;
  inputCost: string;
  laborIntensity: string;
  storageLife: string;
  marketAccess: string;
  expenses: {
    seeds: number;
    fertilizers: number;
    pesticides: number;
    labor: number;
    irrigation: number;
    equipment: number;
    other: number;
  };
  timeline: {
    phases: Phase[];
  };
}

function getCropPhases(crop: Pick<Crop, 'name' | 'duration'>): Phase[] {
  const totalWeeks = Math.ceil(crop.duration / 7);
  const phases: Phase[] = [];
  
  // Define phase distribution based on crop type
  const phaseDistribution: { [key: string]: { prep: number; growth: number; harvest: number } } = {
    "Paddy (Rice)": { prep: 0.15, growth: 0.6, harvest: 0.25 },
    "Maize": { prep: 0.15, growth: 0.6, harvest: 0.25 },
    "Wheat": { prep: 0.15, growth: 0.6, harvest: 0.25 },
    "Mustard": { prep: 0.15, growth: 0.6, harvest: 0.25 },
    "Moong (Green Gram)": { prep: 0.15, growth: 0.6, harvest: 0.25 },
    "Sugarcane": { prep: 0.1, growth: 0.7, harvest: 0.2 },
    "Cotton": { prep: 0.15, growth: 0.6, harvest: 0.25 }
  };

  const distribution = phaseDistribution[crop.name] || { prep: 0.15, growth: 0.6, harvest: 0.25 };
  
  // Calculate weeks for each phase
  const prepWeeks = Math.ceil(totalWeeks * distribution.prep);
  const growthWeeks = Math.ceil(totalWeeks * distribution.growth);
  const harvestWeeks = totalWeeks - prepWeeks - growthWeeks;

  // Add preparation phase
  phases.push({
    name: "Preparation",
    weeks: prepWeeks,
    tips: [
      "Prepare the field by plowing and leveling",
      "Apply recommended fertilizers",
      "Ensure proper drainage system"
    ],
    tasks: [
      "Land preparation",
      "Soil testing",
      "Fertilizer application"
    ],
    risks: [
      "Untimely rains",
      "Soil compaction",
      "Poor drainage"
    ],
    inputs: [
      "Fertilizers",
      "Equipment",
      "Labor"
    ],
    weather: {
      optimal: "Dry weather",
      avoid: "Heavy rainfall"
    },
    progress: 0,
    icon: Sprout
  });

  // Add growth phase
  phases.push({
    name: "Growth",
    weeks: growthWeeks,
    tips: [
      "Monitor water levels regularly",
      "Check for pests and diseases",
      "Apply necessary pesticides"
    ],
    tasks: [
      "Irrigation",
      "Pest control",
      "Weed management"
    ],
    risks: [
      "Pest attacks",
      "Disease outbreak",
      "Water stress"
    ],
    inputs: [
      "Water",
      "Pesticides",
      "Labor"
    ],
    weather: {
      optimal: "Moderate temperature",
      avoid: "Extreme weather"
    },
    progress: 0,
    icon: Leaf
  });

  // Add harvest phase
  phases.push({
    name: "Harvest",
    weeks: harvestWeeks,
    tips: [
      "Harvest at optimal maturity",
      "Proper storage conditions",
      "Market timing"
    ],
    tasks: [
      "Harvesting",
      "Post-harvest handling",
      "Storage"
    ],
    risks: [
      "Untimely rains",
      "Storage losses",
      "Market price fluctuations"
    ],
    inputs: [
      "Harvesting equipment",
      "Storage facilities",
      "Transportation"
    ],
    weather: {
      optimal: "Dry weather",
      avoid: "Rainy conditions"
    },
    progress: 0,
    icon: Wheat
  });

  return phases;
}

// Expanded crop database with at least 2 crops per major state/location
const cropDatabase: Crop[] = [
  {
    name: "Paddy (Rice)",
    seasons: ["Kharif"],
    states: ["Punjab"],
    yield: 2200,
    price: 22,
    demand: 9,
    water: "High",
    soil: "Clay, Loam",
    temperature: { min: 20, max: 35 },
    rainfall: { min: 150, max: 300 },
    duration: 120,
    successRate: 0.88,
    marketStability: 0.9,
    regionalPreference: 0.97,
    pestResistance: 0.7,
    diseaseResistance: 0.75,
    inputCost: "Medium",
    laborIntensity: "High",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 2000,
      fertilizers: 5000,
      pesticides: 3000,
      labor: 8000,
      irrigation: 4000,
      equipment: 2000,
      other: 1000
    },
    timeline: {
      phases: getCropPhases({
        name: "Paddy (Rice)",
        duration: 120
      })
    }
  },
  {
    name: "Maize",
    seasons: ["Kharif"],
    states: ["Punjab"],
    yield: 1800,
    price: 18,
    demand: 8,
    water: "Medium",
    soil: "Loam, Sandy Loam",
    temperature: { min: 18, max: 32 },
    rainfall: { min: 100, max: 200 },
    duration: 90,
    successRate: 0.8,
    marketStability: 0.85,
    regionalPreference: 0.85,
    pestResistance: 0.75,
    diseaseResistance: 0.7,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Medium",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Maize",
        duration: 90
      })
    }
  },
  {
    name: "Wheat",
    seasons: ["Rabi"],
    states: ["Punjab"],
    yield: 2200,
    price: 22,
    demand: 9,
    water: "Medium",
    soil: "Loam, Clay Loam",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 50, max: 150 },
    duration: 120,
    successRate: 0.9,
    marketStability: 0.9,
    regionalPreference: 0.97,
    pestResistance: 0.8,
    diseaseResistance: 0.8,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1500,
      pesticides: 3000,
      labor: 2500,
      irrigation: 900,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Wheat",
        duration: 120
      })
    }
  },
  {
    name: "Mustard",
    seasons: ["Rabi"],
    states: ["Punjab"],
    yield: 400,
    price: 55,
    demand: 8,
    water: "Low",
    soil: "Sandy Loam, Loam",
    temperature: { min: 10, max: 25 },
    rainfall: { min: 25, max: 50 },
    duration: 110,
    successRate: 0.85,
    marketStability: 0.85,
    regionalPreference: 0.9,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Low",
    laborIntensity: "Low",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Mustard",
        duration: 110
      })
    }
  },
  {
    name: "Moong (Green Gram)",
    seasons: ["Zaid"],
    states: ["Punjab"],
    yield: 350,
    price: 80,
    demand: 7,
    water: "Low",
    soil: "Sandy Loam, Loam",
    temperature: { min: 25, max: 35 },
    rainfall: { min: 30, max: 60 },
    duration: 70,
    successRate: 0.75,
    marketStability: 0.8,
    regionalPreference: 0.8,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Low",
    laborIntensity: "Low",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Moong (Green Gram)",
        duration: 70
      })
    }
  },
  // Tamil Nadu
  {
    name: "Sugarcane",
    seasons: ["Kharif"],
    states: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Gujarat", "Punjab", "Haryana"],
    yield: 18000,
    price: 3.2,
    demand: 7,
    water: "Very High",
    soil: "Loam, Clay Loam",
    temperature: { min: 20, max: 38 },
    rainfall: { min: 200, max: 400 },
    duration: 365,
    successRate: 0.75,
    marketStability: 0.95,
    regionalPreference: 0.85,
    pestResistance: 0.65,
    diseaseResistance: 0.7,
    inputCost: "High",
    laborIntensity: "High",
    storageLife: "Short",
    marketAccess: "Medium",
    expenses: {
      seeds: 2000,
      fertilizers: 2500,
      pesticides: 6000,
      labor: 10000,
      irrigation: 2000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Sugarcane",
        duration: 365
      })
    }
  },
  {
    name: "Cotton",
    seasons: ["Kharif"],
    states: ["Gujarat", "Maharashtra", "Punjab", "Haryana", "Rajasthan", "Madhya Pradesh", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    yield: 400,
    price: 65,
    demand: 7,
    water: "Medium",
    soil: "Black Soil, Loam",
    temperature: { min: 20, max: 35 },
    rainfall: { min: 100, max: 200 },
    duration: 180,
    successRate: 0.7,
    marketStability: 0.85,
    regionalPreference: 0.8,
    pestResistance: 0.6,
    diseaseResistance: 0.65,
    inputCost: "High",
    laborIntensity: "High",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1500,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Cotton",
        duration: 180
      })
    }
  },
  // Punjab
  {
    name: "Wheat",
    seasons: ["Rabi"],
    states: ["Punjab", "Uttar Pradesh", "Haryana", "Rajasthan", "Madhya Pradesh", "Bihar", "Gujarat", "Maharashtra"],
    yield: 2200,
    price: 25,
    demand: 8,
    water: "Medium",
    soil: "Loam, Clay Loam",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 50, max: 150 },
    duration: 120,
    successRate: 0.85,
    marketStability: 0.9,
    regionalPreference: 0.9,
    pestResistance: 0.8,
    diseaseResistance: 0.75,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1500,
      pesticides: 3000,
      labor: 2500,
      irrigation: 900,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Wheat",
        duration: 120
      })
    }
  },
  {
    name: "Mustard",
    seasons: ["Rabi"],
    states: ["Punjab", "Haryana", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh"],
    yield: 1000,
    price: 50,
    demand: 7,
    water: "Low",
    soil: "Sandy Loam, Loam",
    temperature: { min: 10, max: 25 },
    rainfall: { min: 25, max: 50 },
    duration: 110,
    successRate: 0.8,
    marketStability: 0.85,
    regionalPreference: 0.85,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Low",
    laborIntensity: "Low",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Mustard",
        duration: 110
      })
    }
  },
  // Maharashtra
  {
    name: "Soybean",
    seasons: ["Kharif"],
    states: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Gujarat", "Chhattisgarh"],
    yield: 1200,
    price: 45,
    demand: 7,
    water: "Medium",
    soil: "Black Soil, Loam",
    temperature: { min: 20, max: 30 },
    rainfall: { min: 100, max: 200 },
    duration: 100,
    successRate: 0.75,
    marketStability: 0.85,
    regionalPreference: 0.8,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Medium",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1500,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Soybean",
        duration: 100
      })
    }
  },
  {
    name: "Jowar (Sorghum)",
    seasons: ["Kharif", "Rabi"],
    states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Madhya Pradesh", "Tamil Nadu"],
    yield: 900,
    price: 20,
    demand: 6,
    water: "Low",
    soil: "Sandy Loam, Loam",
    temperature: { min: 20, max: 32 },
    rainfall: { min: 50, max: 100 },
    duration: 110,
    successRate: 0.7,
    marketStability: 0.8,
    regionalPreference: 0.8,
    pestResistance: 0.75,
    diseaseResistance: 0.7,
    inputCost: "Low",
    laborIntensity: "Low",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Jowar (Sorghum)",
        duration: 110
      })
    }
  },
  // Uttar Pradesh
  {
    name: "Sugarcane",
    seasons: ["Kharif"],
    states: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Gujarat", "Punjab", "Haryana"],
    yield: 18000,
    price: 3.2,
    demand: 7,
    water: "Very High",
    soil: "Loam, Clay Loam",
    temperature: { min: 20, max: 38 },
    rainfall: { min: 200, max: 400 },
    duration: 365,
    successRate: 0.75,
    marketStability: 0.95,
    regionalPreference: 0.85,
    pestResistance: 0.65,
    diseaseResistance: 0.7,
    inputCost: "High",
    laborIntensity: "High",
    storageLife: "Short",
    marketAccess: "Medium",
    expenses: {
      seeds: 2000,
      fertilizers: 2500,
      pesticides: 6000,
      labor: 10000,
      irrigation: 2000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Sugarcane",
        duration: 365
      })
    }
  },
  {
    name: "Potato",
    seasons: ["Rabi"],
    states: ["Uttar Pradesh", "West Bengal", "Bihar", "Punjab", "Gujarat"],
    yield: 25000,
    price: 12,
    demand: 8,
    water: "Medium",
    soil: "Sandy Loam, Loam",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 50, max: 100 },
    duration: 100,
    successRate: 0.8,
    marketStability: 0.85,
    regionalPreference: 0.8,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Short",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Potato",
        duration: 100
      })
    }
  },
  // West Bengal
  {
    name: "Jute",
    seasons: ["Kharif"],
    states: ["West Bengal", "Assam", "Bihar", "Odisha"],
    yield: 2200,
    price: 40,
    demand: 7,
    water: "High",
    soil: "Alluvial",
    temperature: { min: 24, max: 37 },
    rainfall: { min: 150, max: 200 },
    duration: 120,
    successRate: 0.75,
    marketStability: 0.8,
    regionalPreference: 0.85,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Medium",
    laborIntensity: "High",
    storageLife: "Short",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Jute",
        duration: 120
      })
    }
  },
  {
    name: "Rice",
    seasons: ["Kharif", "Rabi"],
    states: ["Karnataka", "Tamil Nadu", "Punjab", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Telangana", "Bihar"],
    yield: 2500,
    price: 22,
    demand: 9,
    water: "High",
    soil: "Clay, Loam",
    temperature: { min: 20, max: 35 },
    rainfall: { min: 150, max: 300 },
    duration: 120,
    successRate: 0.85,
    marketStability: 0.9,
    regionalPreference: 0.95,
    pestResistance: 0.7,
    diseaseResistance: 0.75,
    inputCost: "Medium",
    laborIntensity: "High",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 2000,
      fertilizers: 5000,
      pesticides: 3000,
      labor: 8000,
      irrigation: 4000,
      equipment: 2000,
      other: 1000
    },
    timeline: {
      phases: getCropPhases({
        name: "Rice",
        duration: 120
      })
    }
  },
  // Gujarat
  {
    name: "Groundnut",
    seasons: ["Kharif", "Rabi"],
    states: ["Gujarat", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Maharashtra", "Rajasthan", "Madhya Pradesh"],
    yield: 900,
    price: 55,
    demand: 6,
    water: "Low",
    soil: "Sandy Loam",
    temperature: { min: 20, max: 30 },
    rainfall: { min: 50, max: 150 },
    duration: 100,
    successRate: 0.7,
    marketStability: 0.8,
    regionalPreference: 0.75,
    pestResistance: 0.7,
    diseaseResistance: 0.65,
    inputCost: "Low",
    laborIntensity: "Medium",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Groundnut",
        duration: 100
      })
    }
  },
  {
    name: "Cotton",
    seasons: ["Kharif"],
    states: ["Gujarat", "Maharashtra", "Punjab", "Haryana", "Rajasthan", "Madhya Pradesh", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    yield: 400,
    price: 65,
    demand: 7,
    water: "Medium",
    soil: "Black Soil, Loam",
    temperature: { min: 20, max: 35 },
    rainfall: { min: 100, max: 200 },
    duration: 180,
    successRate: 0.7,
    marketStability: 0.85,
    regionalPreference: 0.8,
    pestResistance: 0.6,
    diseaseResistance: 0.65,
    inputCost: "High",
    laborIntensity: "High",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1500,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Cotton",
        duration: 180
      })
    }
  },
  // Bihar
  {
    name: "Maize",
    seasons: ["Kharif", "Rabi", "Zaid"],
    states: ["Karnataka", "Maharashtra", "Punjab", "Gujarat", "Madhya Pradesh", "Bihar", "Uttar Pradesh", "Andhra Pradesh"],
    yield: 1800,
    price: 18,
    demand: 8,
    water: "Medium",
    soil: "Loam, Sandy Loam",
    temperature: { min: 18, max: 32 },
    rainfall: { min: 100, max: 200 },
    duration: 90,
    successRate: 0.8,
    marketStability: 0.85,
    regionalPreference: 0.8,
    pestResistance: 0.75,
    diseaseResistance: 0.7,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Medium",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Maize",
        duration: 90
      })
    }
  },
  {
    name: "Lentil",
    seasons: ["Rabi"],
    states: ["Bihar", "Uttar Pradesh", "Madhya Pradesh", "West Bengal"],
    yield: 900,
    price: 70,
    demand: 7,
    water: "Low",
    soil: "Loam, Clay Loam",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 30, max: 50 },
    duration: 110,
    successRate: 0.75,
    marketStability: 0.8,
    regionalPreference: 0.8,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Low",
    laborIntensity: "Low",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Lentil",
        duration: 110
      })
    }
  },
  // Andhra Pradesh
  {
    name: "Chilli",
    seasons: ["Kharif", "Rabi"],
    states: ["Andhra Pradesh", "Karnataka", "Telangana", "Tamil Nadu", "Maharashtra"],
    yield: 1200,
    price: 90,
    demand: 8,
    water: "Medium",
    soil: "Sandy Loam, Loam",
    temperature: { min: 20, max: 32 },
    rainfall: { min: 50, max: 100 },
    duration: 120,
    successRate: 0.7,
    marketStability: 0.85,
    regionalPreference: 0.85,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Medium",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Chilli",
        duration: 120
      })
    }
  },
  {
    name: "Tobacco",
    seasons: ["Rabi"],
    states: ["Andhra Pradesh", "Karnataka", "Telangana", "Tamil Nadu"],
    yield: 1800,
    price: 60,
    demand: 6,
    water: "Low",
    soil: "Sandy Loam, Loam",
    temperature: { min: 18, max: 30 },
    rainfall: { min: 30, max: 50 },
    duration: 120,
    successRate: 0.7,
    marketStability: 0.8,
    regionalPreference: 0.8,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Tobacco",
        duration: 120
      })
    }
  },
  // Haryana - Kharif
  {
    name: "Cotton",
    seasons: ["Kharif"],
    states: ["Haryana"],
    yield: 800,
    price: 65,
    demand: 8,
    water: "Medium",
    soil: "Black Soil, Loam",
    temperature: { min: 20, max: 35 },
    rainfall: { min: 100, max: 200 },
    duration: 180,
    successRate: 0.8,
    marketStability: 0.85,
    regionalPreference: 0.9,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "High",
    laborIntensity: "High",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1500,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Cotton",
        duration: 180
      })
    }
  },
  {
    name: "Paddy (Rice)",
    seasons: ["Kharif"],
    states: ["Haryana"],
    yield: 2500,
    price: 22,
    demand: 9,
    water: "High",
    soil: "Clay, Loam",
    temperature: { min: 20, max: 35 },
    rainfall: { min: 150, max: 300 },
    duration: 120,
    successRate: 0.85,
    marketStability: 0.9,
    regionalPreference: 0.95,
    pestResistance: 0.7,
    diseaseResistance: 0.75,
    inputCost: "Medium",
    laborIntensity: "High",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 2000,
      fertilizers: 5000,
      pesticides: 3000,
      labor: 8000,
      irrigation: 4000,
      equipment: 2000,
      other: 1000
    },
    timeline: {
      phases: getCropPhases({
        name: "Paddy (Rice)",
        duration: 120
      })
    }
  },
  // Haryana - Rabi
  {
    name: "Wheat",
    seasons: ["Rabi"],
    states: ["Haryana"],
    yield: 2200,
    price: 25,
    demand: 9,
    water: "Medium",
    soil: "Loam, Clay Loam",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 50, max: 150 },
    duration: 120,
    successRate: 0.9,
    marketStability: 0.9,
    regionalPreference: 0.95,
    pestResistance: 0.8,
    diseaseResistance: 0.8,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Long",
    marketAccess: "High",
    expenses: {
      seeds: 1000,
      fertilizers: 1500,
      pesticides: 3000,
      labor: 2500,
      irrigation: 900,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Wheat",
        duration: 120
      })
    }
  },
  {
    name: "Mustard",
    seasons: ["Rabi"],
    states: ["Haryana"],
    yield: 1000,
    price: 50,
    demand: 8,
    water: "Low",
    soil: "Sandy Loam, Loam",
    temperature: { min: 10, max: 25 },
    rainfall: { min: 25, max: 50 },
    duration: 110,
    successRate: 0.85,
    marketStability: 0.85,
    regionalPreference: 0.9,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Low",
    laborIntensity: "Low",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Mustard",
        duration: 110
      })
    }
  },
  // Haryana - Zaid
  {
    name: "Moong (Green Gram)",
    seasons: ["Zaid"],
    states: ["Haryana"],
    yield: 600,
    price: 80,
    demand: 7,
    water: "Low",
    soil: "Sandy Loam, Loam",
    temperature: { min: 25, max: 35 },
    rainfall: { min: 30, max: 60 },
    duration: 70,
    successRate: 0.75,
    marketStability: 0.8,
    regionalPreference: 0.8,
    pestResistance: 0.7,
    diseaseResistance: 0.7,
    inputCost: "Low",
    laborIntensity: "Low",
    storageLife: "Medium",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Moong (Green Gram)",
        duration: 70
      })
    }
  },
  {
    name: "Watermelon",
    seasons: ["Zaid"],
    states: ["Haryana"],
    yield: 20000,
    price: 6,
    demand: 6,
    water: "Medium",
    soil: "Sandy Loam",
    temperature: { min: 25, max: 40 },
    rainfall: { min: 20, max: 50 },
    duration: 80,
    successRate: 0.7,
    marketStability: 0.75,
    regionalPreference: 0.7,
    pestResistance: 0.6,
    diseaseResistance: 0.65,
    inputCost: "Medium",
    laborIntensity: "Medium",
    storageLife: "Short",
    marketAccess: "Medium",
    expenses: {
      seeds: 1000,
      fertilizers: 1000,
      pesticides: 1000,
      labor: 1000,
      irrigation: 1000,
      equipment: 1000,
      other: 500
    },
    timeline: {
      phases: getCropPhases({
        name: "Watermelon",
        duration: 80
      })
    }
  },
  // ...repeat for other states/cycles as needed...
  // Existing crops for other states...
];

// Example expense and quality data for demo
const cropExpenses = {
  Rice: { seeds: 1200, fertilizer: 1800, labor: 3500, irrigation: 1000 },
  Maize: { seeds: 900, fertilizer: 1200, labor: 2500, irrigation: 800 },
  Sugarcane: { seeds: 2000, fertilizer: 2500, labor: 6000, irrigation: 2000 },
  Wheat: { seeds: 1000, fertilizer: 1500, labor: 3000, irrigation: 900 },
  Groundnut: { seeds: 1600, fertilizer: 1100, labor: 2200, irrigation: 700 },
};
const cropQualityPrices = {
  Rice: { A: 28, B: 22, C: 18 },
  Maize: { A: 22, B: 18, C: 15 },
  Sugarcane: { A: 4, B: 3, C: 2.5 },
  Wheat: { A: 30, B: 25, C: 20 },
  Groundnut: { A: 65, B: 55, C: 45 },
};

// Enhanced recommendation algorithm
function getRecommendedCrops(state: string, season: string, irrigation: string) {
  const currentMonth = new Date().getMonth() + 1;
  const isMonsoon = currentMonth >= 6 && currentMonth <= 9;
  const isWinter = currentMonth >= 10 || currentMonth <= 2;
  const isSummer = currentMonth >= 3 && currentMonth <= 5;

  // Strict filter
  let filtered = cropDatabase
    .filter(crop => {
      const seasonMatch = crop.seasons.includes(season);
      const stateMatch = crop.states.includes(state);
      const waterCompatible =
        (irrigation === "Rainfed" && crop.water === "Low") ||
        (irrigation === "Canal" && ["Low", "Medium"].includes(crop.water)) ||
        (irrigation === "Drip" && ["Low", "Medium", "High"].includes(crop.water)) ||
        (irrigation === "Borewell" && ["Low", "Medium", "High", "Very High"].includes(crop.water));
      const timingCompatible =
        (season === "Kharif" && isMonsoon) ||
        (season === "Rabi" && isWinter) ||
        (season === "Zaid" && isSummer);
      return seasonMatch && stateMatch && waterCompatible && timingCompatible;
    });

  // If no strict matches, relax: ignore irrigation/timing, just match state+season
  if (filtered.length === 0) {
    filtered = cropDatabase.filter(crop => crop.seasons.includes(season) && crop.states.includes(state));
  }

  // If still no matches, relax: just match state
  if (filtered.length === 0) {
    filtered = cropDatabase.filter(crop => crop.states.includes(state));
  }

  // Score and sort
  return filtered
    .map(crop => {
      const score =
        (crop.demand * 0.2) +
        (crop.successRate * 0.15) +
        (crop.marketStability * 0.15) +
        (crop.regionalPreference * 0.1) +
        (crop.pestResistance * 0.1) +
        (crop.diseaseResistance * 0.1) +
        ((crop.price * crop.yield) / 1000 * 0.2);
      return { ...crop, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

const stateDistricts = {
  Karnataka: ["Bangalore", "Mysore", "Mandya", "Kolar", "Tumkur"],
  Maharashtra: ["Mumbai", "Pune", "Nashik", "Aurangabad", "Nagpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  Punjab: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal"],
};

interface PhaseInfo {
  icon: string;
  tips: string[];
}

interface FarmPlannerProps {
  location: { state: string; district: string };
  onLocationChange: (location: { state: string; district: string }) => void;
}

const FarmPlanner = ({ location, onLocationChange }: FarmPlannerProps) => {
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedIrrigation, setSelectedIrrigation] = useState("");
  const [landArea, setLandArea] = useState<number>(1);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const recommendedCrops = getRecommendedCrops(location.state, selectedSeason, selectedIrrigation);

  const handleCropSelect = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowTimeline(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Farm Planner</h1>
      
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <select
            value={location.state}
            onChange={(e) => onLocationChange({ ...location, state: e.target.value, district: stateDistricts[e.target.value][0] })}
            className="w-full p-2 border rounded-md"
          >
            {Object.keys(stateDistricts).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <select
            value={location.district}
            onChange={(e) => onLocationChange({ ...location, district: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            {stateDistricts[location.state]?.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Season</option>
            {cropSeasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Type</label>
          <select
            value={selectedIrrigation}
            onChange={(e) => setSelectedIrrigation(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Irrigation</option>
            {irrigationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Land Area (Acres)</label>
          <Input
            type="number"
            value={landArea}
            onChange={(e) => setLandArea(Number(e.target.value))}
            min="0.1"
            step="0.1"
            className="w-full"
          />
        </div>
      </div>

      {/* Recommended Crops */}
      {recommendedCrops.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recommended Crops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCrops.map((crop) => (
              <Card
                key={crop.name}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCropSelect(crop)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5 text-green-600" />
                    {crop.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yield:</span>
                      <span className="font-medium">{crop.yield} kg/acre</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">₹{crop.price}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{crop.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium">₹{calculateTotalRevenue(crop, landArea).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Expenses:</span>
                      <span className="font-medium">₹{calculateTotalExpenses(crop, landArea).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Profit:</span>
                      <span className={`font-medium ${calculateNetProfit(crop, landArea) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{calculateNetProfit(crop, landArea).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Crop Timeline */}
      {showTimeline && selectedCrop && (
        <div className="mt-8">
          <CropTimeline
            crop={selectedCrop}
            cycle={selectedSeason}
            phases={selectedCrop.timeline.phases}
          />
        </div>
      )}
    </div>
  );
};

function CropTimeline({ crop, cycle, phases }: { crop: Crop; cycle: string; phases: Phase[] }) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const totalWeeks = phases.reduce((sum, phase) => sum + phase.weeks, 0);

  // Calculate start and end dates for each phase
  const today = new Date();
  const updatedPhases = phases.map((phase, index) => {
    const startDate = new Date(today);
    const previousWeeks = phases.slice(0, index).reduce((sum, p) => sum + p.weeks, 0);
    startDate.setDate(today.getDate() + (previousWeeks * 7));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (phase.weeks * 7));
    const isCritical = phase.name === 'Growth' || phase.name === 'Harvest';
    return {
      ...phase,
      start: startDate,
      end: endDate,
      isCritical,
      dependencies: index > 0 ? [phases[index - 1].name] : [],
      resourceIntensity: phase.name === 'Growth' ? 'High' : phase.name === 'Harvest' ? 'Medium' : 'Low'
    };
  });

  return (
    <div className="space-y-8">
      {/* Timeline Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-2xl font-semibold text-gray-900">Crop Growth Timeline</h4>
          <p className="text-gray-600 mt-1">Total Duration: {totalWeeks} weeks</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >Timeline View</button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >Calendar View</button>
          </div>
          <div className="text-sm text-gray-600">
            <div>Start Date: {today.toLocaleDateString()}</div>
            <div>End Date: {updatedPhases[updatedPhases.length - 1].end.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Timeline Bar with Phase Markers Below */}
      {viewMode === 'timeline' && (
        <div className="bg-blue-50 rounded-lg p-6 pb-12 relative">
          {/* Timeline Bar */}
          <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden mb-10">
            {updatedPhases.map((phase, idx) => {
              const width = (phase.weeks / totalWeeks) * 100;
              const left = updatedPhases.slice(0, idx).reduce((sum, p) => sum + (p.weeks / totalWeeks) * 100, 0);
              return (
                <div
                  key={phase.name}
                  className={`absolute h-full transition-all duration-300 ${phase.isCritical ? 'border-2 border-red-500' : ''}`}
                  style={{ left: `${left}%`, width: `${width}%`, backgroundColor: phase.progress === 100 ? '#22c55e' : '#3b82f6' }}
                />
              );
            })}
          </div>
          {/* Phase Markers (icons and names) */}
          <div className="absolute left-0 right-0 flex justify-between top-10">
            {updatedPhases.map((phase, idx) => {
              const Icon = phase.icon;
              return (
                <div key={phase.name} className="flex flex-col items-center w-32">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${phase.isCritical ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-white'}`}>
                    <Icon className={`w-6 h-6 ${phase.isCritical ? 'text-red-500' : 'text-blue-500'}`} />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-900 text-center">{phase.name}</span>
                  <span className="text-xs text-gray-500">{phase.weeks} weeks</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {updatedPhases.map((phase) => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.name}
              className={`relative p-6 rounded-xl border bg-white shadow-sm transition-all cursor-pointer flex flex-col justify-between min-h-[340px] ${selectedPhase === phase.name ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'} ${phase.isCritical ? 'border-l-4 border-l-red-500' : ''}`}
              onClick={() => {
                setSelectedPhase(phase.name);
                setShowDetails(true);
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${phase.isCritical ? 'bg-red-50' : 'bg-blue-50'}`}>
                  <Icon className={`w-6 h-6 ${phase.isCritical ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                    {phase.name}
                    {phase.isCritical && <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-xs text-red-700 font-semibold">Critical Phase</span>}
                  </h5>
                  <p className="text-xs text-gray-500">{phase.start.toLocaleDateString()} - {phase.end.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{phase.weeks} weeks</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${phase.progress}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h6 className="text-sm font-medium text-blue-800 mb-1">Optimal Weather</h6>
                    <p className="text-sm text-blue-700">{phase.weather.optimal}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h6 className="text-sm font-medium text-red-800 mb-1">Avoid</h6>
                    <p className="text-sm text-red-700">{phase.weather.avoid}</p>
                  </div>
                </div>
              </div>
              {/* Footer Section for Resource Intensity and Dependencies */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${phase.resourceIntensity === 'High' ? 'bg-red-100 text-red-700' : phase.resourceIntensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{phase.resourceIntensity} Resource</span>
                {phase.dependencies.length > 0 && (
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700 font-medium">Depends on: {phase.dependencies.join(', ')}</span>
                )}
                <span className="ml-auto text-xs text-gray-500">Progress: <span className="font-semibold text-green-600">{phase.progress}%</span></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar View (unchanged) */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updatedPhases.map((phase) => (
              <div key={phase.name} className="border rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">{phase.name}</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start:</span>
                    <span className="text-sm font-medium">{phase.start.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">End:</span>
                    <span className="text-sm font-medium">{phase.end.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{phase.weeks} weeks</span>
                  </div>
                  {phase.isCritical && (
                    <div className="text-sm text-red-600 font-medium">Critical Phase</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase Details Modal */}
      {showDetails && selectedPhase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  {updatedPhases.find(p => p.name === selectedPhase) && (
                    (() => {
                      const Icon = updatedPhases.find(p => p.name === selectedPhase)!.icon;
                      const phase = updatedPhases.find(p => p.name === selectedPhase)!;
                      return (
                        <div className={`p-3 rounded-full ${phase.isCritical ? 'bg-red-50' : 'bg-blue-50'}`}>
                          <Icon className={`w-8 h-8 ${phase.isCritical ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                      );
                    })()
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedPhase}</h3>
                    <p className="text-gray-600">
                      {updatedPhases.find(p => p.name === selectedPhase)?.start.toLocaleDateString()} - 
                      {updatedPhases.find(p => p.name === selectedPhase)?.end.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tasks */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Tasks</h4>
                  <ul className="space-y-2">
                    {updatedPhases.find(p => p.name === selectedPhase)?.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Tips</h4>
                  <ul className="space-y-2">
                    {updatedPhases.find(p => p.name === selectedPhase)?.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Leaf className="w-5 h-5 text-blue-500 mt-0.5" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Risks</h4>
                  <ul className="space-y-2">
                    {updatedPhases.find(p => p.name === selectedPhase)?.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Inputs */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Required Inputs</h4>
                  <ul className="space-y-2">
                    {updatedPhases.find(p => p.name === selectedPhase)?.inputs.map((input, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Nut className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <span className="text-gray-700">{input}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weather Conditions */}
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-800 mb-3">Weather Conditions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="text-sm font-medium text-green-800 mb-2">Optimal Conditions</h5>
                      <p className="text-green-700">
                        {updatedPhases.find(p => p.name === selectedPhase)?.weather.optimal}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h5 className="text-sm font-medium text-red-800 mb-2">Conditions to Avoid</h5>
                      <p className="text-red-700">
                        {updatedPhases.find(p => p.name === selectedPhase)?.weather.avoid}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phase Dependencies */}
                {updatedPhases.find(p => p.name === selectedPhase)?.dependencies.length > 0 && (
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Phase Dependencies</h4>
                    <p className="text-gray-700">
                      This phase depends on: {updatedPhases.find(p => p.name === selectedPhase)?.dependencies.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateTotalExpenses(crop: Crop, landArea: number): number {
  const expenses = crop.expenses;
  const total = Object.values(expenses).reduce((sum, cost) => sum + cost, 0);
  return total * landArea;
}

function calculateTotalRevenue(crop: Crop, landArea: number): number {
  // Calculate total yield in kg
  const totalYield = crop.yield * landArea;
  // Calculate revenue based on price per kg
  return totalYield * crop.price;
}

function calculateNetProfit(crop: Crop, landArea: number): number {
  const revenue = calculateTotalRevenue(crop, landArea);
  const expenses = calculateTotalExpenses(crop, landArea);
  return revenue - expenses;
}

export default FarmPlanner; 