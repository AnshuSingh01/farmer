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
import aiLogo from "@/assets/logo-new.png";

export type ViewType = 'dashboard' | 'weather' | 'crop-health' | 'ai-assistant' | 'market-prices' | 'farm-planner';

const LOCAL_VIEW_KEY = "krishimitra-current-view";

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
          <main className="flex-1 p-8 overflow-y-auto relative">
            {/* Sticky Header Bar with AI Icon */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur flex items-center justify-between px-6 py-2 mb-6 shadow-sm rounded-b-xl">
              <div className="font-bold text-xl text-green-700">KrishiMitra</div>
              <button
                className="bg-white border border-green-300 hover:border-green-500 rounded-full shadow-lg p-1 flex items-center justify-center transition-all duration-200"
                style={{ boxShadow: '0 2px 8px rgba(34,197,94,0.15)' }}
                onClick={() => setCurrentView('ai-assistant')}
                title="Go to AI Assistant"
              >
                <img src={aiLogo} alt="AI Assistant" className="w-10 h-10 object-contain" />
              </button>
            </div>
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
