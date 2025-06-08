import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, RefreshCw, Search, Download, MapPin } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { fetchAIResponse } from "../lib/ai-assistant-api";
import { useWeather } from "../context/WeatherContext";
import { aiResponses, quickQuestionCategories } from "../../lib/ai-responses";
import { ChatBubble } from "../../components/ChatBubble";
import { QuickQuestion } from "../../components/QuickQuestion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  pinned?: boolean;
  error?: boolean;
}

const LOCAL_STORAGE_KEY = "ai-assistant-messages";

interface AIAssistantProps {
  location: { state: string; district: string };
  onLocationChange: (location: { state: string; district: string }) => void;
}

interface AIRequestPayload {
  messages: { role: string; content: string; }[];
  context?: string;
}

export function AIAssistant({ location, onLocationChange }: AIAssistantProps) {
  // On mount, try to load messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
    if (saved) {
      try {
        return JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch {
        // fallback to default
      }
    }
    return [
      {
        id: uuidv4(),
        text: "Hello! I'm your SmartFarm AI Assistant. I can help you with crop management, weather advice, pest control, and farming best practices. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date(),
      }
    ];
  });

  // Save messages to localStorage on every change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [errorId, setErrorId] = useState<string | null>(null);
  const { weather } = useWeather();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Pin answer
  const handlePin = (id: string) => {
    setPinnedIds((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  // Retry logic
  const handleRetry = async (msg: Message) => {
    setErrorId(null);
    setLoading(true);
    try {
      const context = weather && weather.main
        ? `Current weather: ${Math.round(weather.main.temp)}°C, ${weather.weather?.[0]?.main}, Humidity: ${weather.main.humidity}%.`
        : `Location: ${location.state}, ${location.district}`;
      const payload: AIRequestPayload = {
        messages: [{ role: 'user', content: msg.text }],
        context
      };
      const response = await fetchAIResponse(payload);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, text: response, error: false } : m));
    } catch {
      setErrorId(msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, error: true } : m));
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: uuidv4(),
      text: content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate AI response
    const payload: AIRequestPayload = {
      messages: [...messages, newMessage].map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      context: `Location: ${location.state}, ${location.district}`
    };

    try {
      const response = await fetchAIResponse(payload);
      const aiResponse: Message = {
        id: uuidv4(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('AI API error:', err);
      setErrorId(newMessage.id);
      setMessages(prev => [...prev, {
        id: newMessage.id,
        text: "Sorry, I couldn't process your request.",
        sender: 'ai',
        timestamp: new Date(),
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        handleSendMessage(inputText);
      }, 300);
    }
  };

  // Quick question handler
  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  // Weather-aware tip
  const getWeatherTip = () => {
    if (weather && weather.main) {
      return `🌦️ Tip: Since it's ${weather.weather?.[0]?.main?.toLowerCase()} and humidity is ${weather.main.humidity}%, adjust irrigation accordingly.`;
    }
    return null;
  };

  // Reset chat handler
  const handleResetChat = () => {
    setMessages([
      {
        id: uuidv4(),
        text: "Hello! I'm your SmartFarm AI Assistant. I can help you with crop management, weather advice, pest control, and farming best practices. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
    setPinnedIds([]);
    setErrorId(null);
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Text-to-speech function
  const speakMessage = (text: string) => {
    if (!speechSynthesis) return;
    
    if (speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  // Download chat history
  const downloadChat = () => {
    const pinnedMessages = messages.filter(msg => pinnedIds.includes(msg.id));
    const content = pinnedMessages.map(msg => 
      `${msg.sender === 'user' ? 'You' : 'AI'}: ${msg.text}\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Farming Assistant</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {location.state}, {location.district}
            </p>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleResetChat}
                    variant="outline"
                    className="flex items-center gap-2"
                    aria-label="Reset chat history"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Chat
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear entire conversation?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={downloadChat}
                    variant="outline"
                    className="flex items-center gap-2"
                    aria-label="Download chat history"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download pinned messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col h-[600px]">
          <Card className="border-0 shadow-md flex flex-col h-full">
            <CardHeader className="sticky top-0 z-10 bg-white dark:bg-slate-900">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Chat with AI Assistant
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-[200px]"
                    aria-label="Search chat messages"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-y-auto">
              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto space-y-2 mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                role="log"
                aria-label="Chat messages"
              >
                {(isSearching ? filteredMessages : messages).map((message) => (
                  <ChatBubble
                    key={message.id}
                    sender={message.sender}
                    message={message.text}
                    timestamp={message.timestamp.toLocaleTimeString()}
                    pinned={pinnedIds.includes(message.id)}
                    onPin={message.sender === 'ai' ? () => handlePin(message.id) : undefined}
                    error={!!message.error}
                    onRetry={message.error ? () => handleRetry(message) : undefined}
                    onSpeak={() => speakMessage(message.text)}
                    speaking={speaking}
                  />
                ))}
                {loading && (
                  <div 
                    className="flex items-center gap-2"
                    aria-live="polite"
                    aria-label="AI is typing"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Weather-aware tip */}
              {getWeatherTip() && (
                <div className="mb-2 px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded shadow">
                  {getWeatherTip()}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2 sticky bottom-0 bg-white dark:bg-slate-900 py-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything about farming..."
                  onKeyDown={handleInputKeyDown}
                  className="flex-1"
                  disabled={loading}
                  aria-label="Type your message"
                />
                <Button
                  onClick={() => handleSendMessage(inputText)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Questions */}
        <div className="flex flex-col gap-4">
          {quickQuestionCategories.map((cat) => (
            <QuickQuestion
              key={cat.title}
              icon={cat.icon}
              title={cat.title}
              subtitle={cat.subtitle}
              questions={cat.questions}
              onAsk={handleQuickQuestion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
