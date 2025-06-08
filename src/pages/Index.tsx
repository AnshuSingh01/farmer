import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { WeatherWidget } from "@/components/WeatherWidget";
import { CropHealth } from "@/components/CropHealth";
import { AIAssistant } from "@/components/AIAssistant";
import { MarketPrices } from "@/components/MarketPrices";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WeatherProvider } from "../context/WeatherContext";
import FarmPlanner from "./FarmPlanner";

export type ViewType = 'dashboard' | 'weather' | 'crop-health' | 'ai-assistant' | 'market-prices' | 'farm-planner';

const LOCAL_VIEW_KEY = "smartfarm-current-view";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_VIEW_KEY);
      if (saved) return saved as ViewType;
    }
    return 'dashboard';
  });
  const [globalLocation, setGlobalLocation] = useState({ state: "Karnataka", district: "Bangalore" });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_VIEW_KEY, currentView);
    }
  }, [currentView]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard location={globalLocation} onLocationChange={setGlobalLocation} />;
      case 'weather':
        return <WeatherWidget location={globalLocation} onLocationChange={setGlobalLocation} />;
      case 'crop-health':
        return <CropHealth location={globalLocation} onLocationChange={setGlobalLocation} />;
      case 'ai-assistant':
        return <AIAssistant location={globalLocation} onLocationChange={setGlobalLocation} />;
      case 'market-prices':
        return <MarketPrices location={globalLocation} onLocationChange={setGlobalLocation} />;
      case 'farm-planner':
        return <FarmPlanner location={globalLocation} onLocationChange={setGlobalLocation} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WeatherProvider location={globalLocation}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
          <Sidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            currentLocation={globalLocation}
            onLocationChange={setGlobalLocation}
          />
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="animate-fade-in">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </WeatherProvider>
  );
};

export default Index;
