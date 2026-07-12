"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Wrench,
  Search,
  RefreshCw
} from "lucide-react";
import { loadFinanceData, AIInsight } from "../mockData";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function FinancialInsights() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "bot",
      text: "Hello! I am your TransitOps Financial Co-Pilot. I have crawled the ledger, telematics trip sheets, and fuel reports. Ask me anything about cost optimization, route profitability, or budget deficits!",
      timestamp: "Just now"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFinanceData(loadFinanceData());
    const handleUpdate = () => setFinanceData(loadFinanceData());
    window.addEventListener("finance_data_update", handleUpdate);
    return () => window.removeEventListener("finance_data_update", handleUpdate);
  }, []);

  useEffect(() => {
    // Scroll chat to bottom
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!financeData) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { insights } = financeData;

  // Filter insights
  const filteredInsights = insights.filter((ins: AIInsight) => {
    if (categoryFilter === "All") return true;
    return ins.category === categoryFilter;
  });

  // AI chat replies simulator
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    const query = userMsg.text.toLowerCase();

    // Answer generator
    setTimeout(() => {
      let botText = "";

      if (query.includes("fuel") || query.includes("diesel") || query.includes("electric") || query.includes("ev")) {
        botText = "According to June efficiency metrics, transitioning the Scania R500 (MH-12-AS-4501) routes to Tesla Semi EVs will cut fuel costs by 86% per kilometer, resulting in ₹37,200 monthly savings. EV fleets run at ₹0.46-0.50/km vs Diesel at ₹3.08-3.52/km.";
      } else if (query.includes("maintenance") || query.includes("repair") || query.includes("gearbox") || query.includes("brake")) {
        botText = "Maintenance spending is currently 3.4% above budget. This was triggered by transmission fluid flush and gear clutch overhaul on Volvo FH16 (MH-12-JK-8821) on July 7, costing ₹2,800. Vehicle MH-12-AS-4501 is also logging 24% higher repair overhead than fleet averages.";
      } else if (query.includes("route") || query.includes("profitable") || query.includes("margin") || query.includes("pune") || query.includes("bangalore")) {
        botText = "The Hyderabad-Bangalore Corridor is our most profitable route, delivering a 76.5% profit margin (revenue ₹31,000 against expenses ₹7,300). Conversely, the Pune-Nagpur Route runs at a lower 50.0% margin due to heavy diesel requirements.";
      } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
        botText = "Hello! Try asking me: 'How to reduce fuel costs?', 'Why are maintenance costs high?', or 'What is the most profitable route?' I will retrieve real-time stats from the ledger.";
      } else {
        botText = "I've analyzed the financial tables. I recommend querying about: 'fuel savings', 'route margins', or 'maintenance budgets'. For example, I can break down Scania vs Tesla operating costs.";
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="insights-dashboard-title">AI Financial Insights</h1>
          <p className="text-sm text-text-secondary">Intelligent cost anomaly detection, EV fleet profitability recommendations, and ledger co-pilot.</p>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left 3/5 Column: Anomaly Alerts & Opportunities */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card">
            <div className="flex justify-between items-center pb-3 border-b border-border-app mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary animate-pulse" size={18} />
                <h3 className="font-semibold text-text-primary text-sm">Automated Financial Diagnostics</h3>
              </div>
              
              {/* Category selector */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-8 border border-border-app rounded text-[11px] px-2 bg-gray-50 text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="All">All Anomalies</option>
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Revenue">Revenue</option>
                <option value="Budget">Budget</option>
              </select>
            </div>

            {/* List of Insights */}
            <div className="space-y-3">
              {filteredInsights.map((ins: AIInsight) => (
                <div 
                  key={ins.id}
                  className={`p-4 rounded-m border flex gap-3.5 items-start transition-all hover:shadow-small
                    ${ins.type === "critical" ? "bg-error-light border-error/20" : 
                      ins.type === "warning" ? "bg-warning-light/15 border-warning/25" : 
                      ins.type === "success" ? "bg-success-light text-text-primary border-success/20" : 
                      "bg-primary-light/10 border-primary/10"
                    }
                  `}
                >
                  {/* Category icon */}
                  <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 shadow-small
                    ${ins.category === "Fuel" ? "bg-primary text-text-on-primary" : 
                      ins.category === "Maintenance" ? "bg-teal-700 text-text-on-primary" : 
                      ins.category === "Revenue" ? "bg-success text-text-on-primary" : 
                      "bg-indigo-600 text-text-on-primary"
                    }
                  `}>
                    {ins.category === "Fuel" ? <Flame size={16} /> : 
                     ins.category === "Maintenance" ? <Wrench size={16} /> : 
                     ins.category === "Revenue" ? <TrendingUp size={16} /> : 
                     <ShieldAlert size={16} />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{ins.category} Segment</span>
                      <span className="text-[10px] text-text-muted">{ins.timestamp}</span>
                    </div>
                    <p className="text-xs text-text-primary font-medium leading-relaxed">{ins.text}</p>
                  </div>
                </div>
              ))}
              {filteredInsights.length === 0 && (
                <div className="text-center text-xs text-text-secondary py-12">No active anomalies detected in this category filter.</div>
              )}
            </div>
          </div>

          {/* Quick Action Suggestion */}
          <div className="bg-surface-app border border-border-app p-4 rounded-m shadow-card flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-circular bg-success animate-ping" />
              <span className="text-text-secondary">All telemetry data matched with financial records. Audits are compliant.</span>
            </div>
          </div>
        </div>

        {/* Right 2/5 Column: AI Chat assistant Co-Pilot */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-m shadow-card flex flex-col h-[480px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-border-app bg-gray-50 flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-circular bg-primary text-text-on-primary flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-xs">Financial Analyst Assistant</h3>
              <p className="text-[10px] text-text-secondary">TransitOps AI Audit Core</p>
            </div>
          </div>

          {/* Chat Message Box */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 items-start ${isBot ? "justify-start" : "justify-end"}`}
                >
                  {isBot && (
                    <div className="h-6 w-6 rounded-circular bg-gray-100 flex items-center justify-center shrink-0 border border-border-app">
                      <Bot size={12} className="text-primary" />
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-m max-w-[80%] space-y-1 relative shadow-small
                    ${isBot ? "bg-gray-100 text-text-primary rounded-tl-none border border-gray-200" : "bg-primary text-text-on-primary rounded-tr-none"}
                  `}>
                    <p className="leading-relaxed font-medium">{msg.text}</p>
                    <span className={`block text-[9px] text-right leading-none ${isBot ? "text-text-muted" : "text-text-on-primary/60"}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="h-6 w-6 rounded-circular bg-primary-light text-primary border border-primary/10 flex items-center justify-center shrink-0">
                      <User size={12} />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 items-start justify-start animate-pulse">
                <div className="h-6 w-6 rounded-circular bg-gray-100 flex items-center justify-center border border-border-app">
                  <Bot size={12} className="text-primary" />
                </div>
                <div className="p-3 bg-gray-100 border border-gray-200 rounded-m rounded-tl-none text-text-secondary font-bold font-mono">
                  AI is searching ledger...
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Suggestions */}
          <div className="p-2 border-t border-gray-100 bg-gray-50 flex gap-1.5 overflow-x-auto shrink-0 select-none">
            {[
              "How to reduce fuel costs?",
              "Why is maintenance high?",
              "What route is most profitable?"
            ].map((suggest) => (
              <button
                key={suggest}
                onClick={() => setInputVal(suggest)}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-border-app rounded text-[9px] font-semibold text-text-secondary whitespace-nowrap cursor-pointer transition-all"
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* Chat Form Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border-app bg-white flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask a question about the operating costs..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 h-9 px-3 border border-border-app rounded-m text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="h-9 w-9 rounded-m bg-primary hover:bg-primary/95 text-text-on-primary flex items-center justify-center shadow-small disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
