import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Sprout, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Camera,
  BarChart3,
  MapPin
} from "lucide-react";

interface CropHealthProps {
  location: { state: string; district: string };
  onLocationChange: (location: { state: string; district: string }) => void;
}

export function CropHealth({ location, onLocationChange }: CropHealthProps) {
  const healthScores = [
    { crop: "Rice Field A", score: 85, status: "Healthy", color: "text-green-600" },
    { crop: "Wheat Field B", score: 72, status: "Good", color: "text-blue-600" },
    { crop: "Sugarcane Field C", score: 95, status: "Excellent", color: "text-green-600" },
    { crop: "Cotton Field D", score: 58, status: "Needs Attention", color: "text-yellow-600" },
  ];

  const detectedIssues = [
    {
      field: "Cotton Field D",
      issue: "Leaf Spot Disease",
      severity: "Medium",
      recommendation: "Apply fungicide treatment within 2-3 days",
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      field: "Wheat Field B",
      issue: "Nitrogen Deficiency",
      severity: "Low",
      recommendation: "Increase nitrogen-based fertilizer application",
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ];

  const growthMetrics = [
    { metric: "Plant Height", value: "95cm", target: "100cm", progress: 95 },
    { metric: "Leaf Area Index", value: "4.2", target: "5.0", progress: 84 },
    { metric: "Chlorophyll Content", value: "42 SPAD", target: "45 SPAD", progress: 93 },
    { metric: "Soil Moisture", value: "68%", target: "70%", progress: 97 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Health Monitor</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {location.state}, {location.district}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Camera className="w-4 h-4" />
            Scan Crop
          </button>
        </div>
      </div>

      {/* Health Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthScores.map((item, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{item.crop}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-900">{item.score}%</span>
                <Sprout className={`w-6 h-6 ${item.color}`} />
              </div>
              <Progress value={item.score} className="mb-2" />
              <p className={`text-sm font-medium ${item.color}`}>{item.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detected Issues */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Detected Issues
            </CardTitle>
            <CardDescription>Issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectedIssues.length > 0 ? (
              detectedIssues.map((issue, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <issue.icon className={`w-5 h-5 ${issue.color}`} />
                      <h4 className="font-semibold text-gray-900">{issue.issue}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                      issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{issue.field}</p>
                  <p className="text-sm text-gray-700">{issue.recommendation}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-600">No issues detected in your crops!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Growth Metrics */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Growth Metrics
            </CardTitle>
            <CardDescription>Key performance indicators for crop development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {growthMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className="text-sm text-gray-500">{metric.value} / {metric.target}</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
                <div className="text-right">
                  <span className="text-xs text-gray-500">{metric.progress}% of target</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Recent Crop Scans</CardTitle>
          <CardDescription>Latest AI-powered crop health assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { field: "Rice Field A", date: "2 hours ago", status: "Healthy", image: "🌾" },
              { field: "Wheat Field B", date: "1 day ago", status: "Good", image: "🌾" },
              { field: "Sugarcane Field C", date: "2 days ago", status: "Excellent", image: "🎋" },
            ].map((scan, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-4xl mb-3 text-center">{scan.image}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{scan.field}</h4>
                <p className="text-sm text-gray-500 mb-2">{scan.date}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  scan.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                  scan.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {scan.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
