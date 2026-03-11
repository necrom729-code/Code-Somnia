"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

interface VPNServer {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  ip: string;
}

const AVAILABLE_SERVERS: VPNServer[] = [
  { id: "us-1", country: "United States", countryCode: "US", flag: "🇺🇸", city: "New York", ip: "104.238.156.42" },
  { id: "us-2", country: "United States", countryCode: "US", flag: "🇺🇸", city: "Los Angeles", ip: "104.238.156.43" },
  { id: "uk-1", country: "United Kingdom", countryCode: "GB", flag: "🇬🇧", city: "London", ip: "185.243.115.84" },
  { id: "de-1", country: "Germany", countryCode: "DE", flag: "🇩🇪", city: "Frankfurt", ip: "178.162.142.175" },
  { id: "fr-1", country: "France", countryCode: "FR", flag: "🇫🇷", city: "Paris", ip: "151.80.156.88" },
  { id: "nl-1", country: "Netherlands", countryCode: "NL", flag: "🇳🇱", city: "Amsterdam", ip: "145.239.9.43" },
  { id: "jp-1", country: "Japan", countryCode: "JP", flag: "🇯🇵", city: "Tokyo", ip: "202.181.96.52" },
  { id: "sg-1", country: "Singapore", countryCode: "SG", flag: "🇸🇬", city: "Singapore", ip: "128.199.104.191" },
  { id: "au-1", country: "Australia", countryCode: "AU", flag: "🇦🇺", city: "Sydney", ip: "139.99.123.45" },
  { id: "ca-1", country: "Canada", countryCode: "CA", flag: "🇨🇦", city: "Toronto", ip: "167.114.77.12" },
  { id: "br-1", country: "Brazil", countryCode: "BR", flag: "🇧🇷", city: "São Paulo", ip: "177.54.144.67" },
  { id: "in-1", country: "India", countryCode: "IN", flag: "🇮🇳", city: "Mumbai", ip: "139.59.86.219" },
  { id: "kr-1", country: "South Korea", countryCode: "KR", flag: "🇰🇷", city: "Seoul", ip: "52.79.87.123" },
  { id: "ch-1", country: "Switzerland", countryCode: "CH", flag: "🇨🇭", city: "Zurich", ip: "185.212.129.99" },
  { id: "se-1", country: "Sweden", countryCode: "SE", flag: "🇸🇪", city: "Stockholm", ip: "185.112.146.77" },
];

export default function VPNPanel() {
  const { t } = useI18n();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<VPNServer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentIP, setCurrentIP] = useState<string | null>(null);
  const [showServers, setShowServers] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Simulated real IP detection
  const [realIP, setRealIP] = useState<string | null>(null);
  
  // Connection time
  const [connectionTime, setConnectionTime] = useState<number>(0);
  const connectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect real IP on mount
  useEffect(() => {
    // Simulate detecting real IP
    const detectIP = async () => {
      // In a real app, this would call an IP detection API
      // For simulation, we'll use a mock IP
      setRealIP("203.0.113.45");
    };
    detectIP();
  }, []);

  // Connection timer
  useEffect(() => {
    if (isConnected && selectedServer) {
      connectionTimerRef.current = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (connectionTimerRef.current) {
        clearInterval(connectionTimerRef.current);
      }
      // Use setTimeout to avoid cascading renders warning
      setTimeout(() => setConnectionTime(0), 0);
    }
    return () => {
      if (connectionTimerRef.current) {
        clearInterval(connectionTimerRef.current);
      }
    };
  }, [isConnected, selectedServer]);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowServers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function connectToServer(server: VPNServer) {
    setSelectedServer(server);
    setIsConnecting(true);
    setShowServers(false);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setCurrentIP(server.ip);
    }, 1500);
  }

  function disconnect() {
    setIsConnected(false);
    setSelectedServer(null);
    setCurrentIP(null);
  }

  function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Group servers by country
  const serversByCountry = AVAILABLE_SERVERS.reduce((acc, server) => {
    if (!acc[server.country]) {
      acc[server.country] = [];
    }
    acc[server.country].push(server);
    return acc;
  }, {} as Record<string, VPNServer[]>);

  return (
    <div ref={panelRef} className="relative">
      {/* VPN Status Button */}
      <button
        onClick={() => setShowServers(!showServers)}
        className="flex items-center gap-2 px-3 py-2 border transition-all"
        style={{ 
          borderColor: isConnected ? "#55efc4" : "#1a3a5c", 
          background: isConnected ? "rgba(85, 239, 196, 0.1)" : "rgba(0,0,0,0.3)" 
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? "animate-pulse" : ""}`}
            style={{ 
              background: isConnected ? "#55efc4" : isConnecting ? "#f39c12" : "#ff3a3a",
              boxShadow: isConnected ? "0 0 6px #55efc4" : "0 0 6px #ff3a3a"
            }}
          />
          <span className="text-xs" style={{ color: isConnected ? "#55efc4" : "#3a6080" }}>
            {isConnected ? "VPN" : isConnecting ? t("vpn.connecting") : t("vpn.disconnected")}
          </span>
        </div>
        {isConnected && selectedServer && (
          <span className="text-xs ml-2" style={{ color: "#55efc4" }}>
            {selectedServer.flag} {selectedServer.city}
          </span>
        )}
      </button>

      {/* Server Selection Panel */}
      {showServers && (
        <div
          className="absolute right-0 top-full mt-2 w-80 z-50 border overflow-hidden"
          style={{
            background: "rgba(5, 10, 15, 0.98)",
            borderColor: "#1a3a5c",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Panel Header */}
          <div className="p-3 border-b" style={{ borderColor: "#1a3a5c" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-widest" style={{ color: "#00d4ff" }}>
                {t("vpn.title")}
              </span>
              {isConnected && (
                <button
                  onClick={disconnect}
                  className="text-xs px-2 py-1 border hover:bg-red-900/30 transition-colors"
                  style={{ color: "#ff3a3a", borderColor: "#ff3a3a" }}
                >
                  {t("vpn.disconnect")}
                </button>
              )}
            </div>
            
            {/* Current Status */}
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span style={{ color: "#3a6080" }}>{t("vpn.realIP")}: </span>
                <span style={{ color: "#ff3a3a" }}>{realIP || "..."}</span>
              </div>
              {isConnected && currentIP && (
                <div>
                  <span style={{ color: "#3a6080" }}>{t("vpn.vpnIP")}: </span>
                  <span style={{ color: "#55efc4" }}>{currentIP}</span>
                </div>
              )}
            </div>
            
            {isConnected && (
              <div className="mt-2 text-xs" style={{ color: "#55efc4" }}>
                {t("vpn.connected")}: {formatTime(connectionTime)}
              </div>
            )}
          </div>

          {/* Server List */}
          <div className="max-h-64 overflow-y-auto">
            {isConnecting && (
              <div className="p-4 text-center">
                <div className="text-sm mb-2" style={{ color: "#f39c12" }}>{t("vpn.connecting")}...</div>
                <div className="text-xs" style={{ color: "#3a6080" }}>
                  {selectedServer?.flag} {selectedServer?.city}
                </div>
              </div>
            )}
            
            {!isConnecting && Object.entries(serversByCountry).map(([country, servers]) => (
              <div key={country}>
                <div 
                  className="px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "#3a6080", background: "rgba(0,0,0,0.3)" }}
                >
                  <span>{servers[0].flag}</span>
                  <span>{country}</span>
                </div>
                {servers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => connectToServer(server)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-white/5"
                    style={{
                      background: selectedServer?.id === server.id ? "rgba(0, 212, 255, 0.1)" : undefined,
                      borderLeft: selectedServer?.id === server.id ? "3px solid #00d4ff" : undefined,
                    }}
                  >
                    <div>
                      <div className="text-xs" style={{ color: "#a0c8e0" }}>
                        {server.city}
                      </div>
                      <div className="text-xs" style={{ color: "#3a6080" }}>
                        {server.ip}
                      </div>
                    </div>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: selectedServer?.id === server.id ? "#55efc4" : "transparent",
                        border: "1px solid #3a6080"
                      }}
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t text-xs text-center" style={{ color: "#3a6080", borderColor: "#1a3a5c" }}>
            {t("vpn.servers")}: {AVAILABLE_SERVERS.length} {t("vpn.countries")}: {Object.keys(serversByCountry).length}
          </div>
        </div>
      )}
    </div>
  );
}
