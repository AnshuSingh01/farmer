import { 
  LayoutDashboard, 
  Cloud, 
  Sprout, 
  MessageSquare, 
  TrendingUp,
  Leaf,
  ChevronRight
} from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ViewType } from "@/pages/Index";
import krishimitraLogo from "@/assets/krishimitra-logo.png"; // Place your logo in src/assets/
import { LocationSelector } from "@/components/LocationSelector";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  currentLocation: { state: string; district: string };
  onLocationChange: (location: { state: string; district: string }) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    view: "dashboard" as ViewType,
    description: "Farm overview",
  },
  {
    title: "Weather",
    icon: Cloud,
    view: "weather" as ViewType,
    description: "Forecast & alerts",
  },
  {
    title: "Crop Health",
    icon: Sprout,
    view: "crop-health" as ViewType,
    description: "AI monitoring",
  },
  {
    title: "AI Assistant",
    icon: MessageSquare,
    view: "ai-assistant" as ViewType,
    description: "Smart advice",
  },
  {
    title: "Market Prices",
    icon: TrendingUp,
    view: "market-prices" as ViewType,
    description: "Live prices",
  },
  {
    title: "Farm Planner",
    icon: Sprout,
    view: "farm-planner" as ViewType,
    description: "Plan crops & tasks",
  },
];

export function Sidebar({ currentView, onViewChange, currentLocation, onLocationChange }: SidebarProps) {
  return (
    <SidebarComponent className="border-r border-green-200 bg-gradient-to-b from-white to-green-50/50 backdrop-blur-sm">
      <SidebarHeader className="p-3 border-b border-green-200">
        <div className="flex items-center justify-center h-24">
          <img 
            src={krishimitraLogo} 
            alt="KrishiMitra Logo" 
            className="h-20 w-auto object-contain hover:scale-105 transition-all duration-300" 
          />
        </div>
        <div className="mt-4">
          <LocationSelector currentLocation={currentLocation} onLocationChange={onLocationChange} />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-green-700 font-semibold text-base uppercase tracking-wider mb-4">
            Farming Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.view)}
                    isActive={currentView === item.view}
                    className={`w-full justify-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 hover:text-green-800 transition-all duration-300 group ${
                      currentView === item.view 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-lg border-2 border-green-300 scale-105' 
                        : 'text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      currentView === item.view 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-green-500 group-hover:text-white'
                    }`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-base">{item.title}</span>
                      <p className="text-sm opacity-80 mt-1">{item.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                      currentView === item.view ? 'rotate-90 text-green-600' : 'text-gray-400 group-hover:translate-x-1'
                    }`} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Status Indicator */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">System Status</span>
          </div>
          <p className="text-xs text-gray-600">All systems operational</p>
          <div className="mt-2 flex gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </SidebarContent>
    </SidebarComponent>
  );
}
