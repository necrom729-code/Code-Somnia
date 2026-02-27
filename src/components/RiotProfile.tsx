"use client";

import { useState, useEffect } from "react";

// Riot/LoL profile data types
interface RiotPlayer {
  summonerName: string;
  summonerLevel: number;
  tier: string;
  division: string;
  lp: number;
  wins: number;
  losses: number;
  kda: string;
  csPerMin: number;
  championMasteries: { champion: string; points: number; level: number }[];
}

interface MatchDetail {
  id: number;
  champion: string;
  championIcon: string;
  result: "VICTORY" | "DEFEAT";
  queue: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  csPerMin: number;
  duration: string;
  items: number[];
  spells: string[];
  timestamp: string;
  lpChange: number;
  opponent: string;
}

// Mock data for Riot player profile
const MOCK_RIOT_PLAYER: RiotPlayer = {
  summonerName: "ShadowOperator",
  summonerLevel: 247,
  tier: "DIAMOND",
  division: "II",
  lp: 85,
  wins: 342,
  losses: 287,
  kda: "3.84",
  csPerMin: 7.8,
  championMasteries: [
    { champion: "Ahri", points: 125400, level: 7 },
    { champion: "Jinx", points: 98200, level: 7 },
    { champion: "Thresh", points: 87400, level: 7 },
    { champion: "Zed", points: 65100, level: 6 },
    { champion: "Yasuo", points: 52300, level: 6 },
  ],
};

// Mock detailed match history
const MOCK_MATCH_DETAILS: MatchDetail[] = [
  {
    id: 1,
    champion: "Ahri",
    championIcon: "🦊",
    result: "VICTORY",
    queue: "Ranked Solo/Duo",
    kills: 11,
    deaths: 3,
    assists: 8,
    cs: 234,
    csPerMin: 7.9,
    duration: "29:42",
    items: [1, 2, 3, 4, 5, 6, 7],
    spells: ["Ignite", "Flash"],
    timestamp: "2 hours ago",
    lpChange: 24,
    opponent: "Sylas",
  },
  {
    id: 2,
    champion: "Jinx",
    championIcon: "💣",
    result: "DEFEAT",
    queue: "Ranked Solo/Duo",
    kills: 8,
    deaths: 7,
    assists: 12,
    cs: 287,
    csPerMin: 8.5,
    duration: "33:51",
    items: [1, 2, 3, 4, 5, 6, 7],
    spells: ["Heal", "Flash"],
    timestamp: "4 hours ago",
    lpChange: -18,
    opponent: "Kai'Sa",
  },
  {
    id: 3,
    champion: "Thresh",
    championIcon: "⛓️",
    result: "VICTORY",
    queue: "Ranked Flex",
    kills: 2,
    deaths: 4,
    assists: 18,
    cs: 67,
    csPerMin: 2.1,
    duration: "31:15",
    items: [1, 2, 3, 4, 5, 6, 7],
    spells: ["Exhaust", "Flash"],
    timestamp: "Yesterday",
    lpChange: 15,
    opponent: "Leona",
  },
  {
    id: 4,
    champion: "Zed",
    championIcon: "🗡️",
    result: "VICTORY",
    queue: "Ranked Solo/Duo",
    kills: 14,
    deaths: 5,
    assists: 4,
    cs: 198,
    csPerMin: 8.2,
    duration: "24:12",
    items: [1, 2, 3, 4, 5, 6, 7],
    spells: ["Ignite", "Flash"],
    timestamp: "Yesterday",
    lpChange: 28,
    opponent: "Akali",
  },
  {
    id: 5,
    champion: "Yasuo",
    championIcon: "🌪️",
    result: "DEFEAT",
    queue: "Ranked Solo/Duo",
    kills: 6,
    deaths: 8,
    assists: 2,
    cs: 178,
    csPerMin: 6.9,
    duration: "25:48",
    items: [1, 2, 3, 4, 5, 6, 7],
    spells: ["Ignite", "Flash"],
    timestamp: "2 days ago",
    lpChange: -22,
    opponent: "Irelia",
  },
];

interface RiotProfileProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function RiotProfile({ isConnected, onConnect, onDisconnect }: RiotProfileProps) {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [queueFilter, setQueueFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");

  if (!isConnected) {
    return <RiotConnect onConnect={onConnect} />;
  }

  const player = MOCK_RIOT_PLAYER;
  const winRate = Math.round((player.wins / (player.wins + player.losses)) * 100);
  const matches = MOCK_MATCH_DETAILS;

  const filteredMatches = matches.filter((match) => {
    if (queueFilter !== "all" && match.queue !== queueFilter) return false;
    if (resultFilter === "win" && match.result !== "VICTORY") return false;
    if (resultFilter === "loss" && match.result !== "DEFEAT") return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Player Header */}
      <div className="border p-4" style={{ borderColor: "#c9a227", background: "linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(0,0,0,0.3) 100%)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Summoner Icon */}
            <div
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl"
              style={{ borderColor: "#c9a227", background: "rgba(0,0,0,0.5)" }}
            >
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold" style={{ color: "#c9a227" }}>
                  {player.summonerName}
                </h3>
                <span
                  className="px-2 py-0.5 text-xs"
                  style={{ background: "#c9a227", color: "#000" }}
                >
                  Lv.{player.summonerLevel}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-1 text-sm font-bold"
                  style={{
                    background: getTierColor(player.tier),
                    color: "#000",
                  }}
                >
                  {player.tier} {player.division}
                </span>
                <span className="text-lg font-bold" style={{ color: "#c9a227" }}>
                  {player.lp} LP
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <QuickStat label="WIN RATE" value={`${winRate}%`} color="#55efc4" />
            <QuickStat
              label="WINS/LOSSES"
              value={`${player.wins}W / ${player.losses}L`}
              color="#a0c8e0"
            />
            <QuickStat label="KDA" value={player.kda} color="#f39c12" />
            <QuickStat label="CS/MIN" value={player.csPerMin.toString()} color="#3498db" />
          </div>
        </div>
      </div>

      {/* Champion Masteries */}
      <div className="border p-4" style={{ borderColor: "#1a3a5c" }}>
        <h4 className="text-sm font-bold mb-3" style={{ color: "#c9a227" }}>
          🔥 CHAMPION MASTERIES
        </h4>
        <div className="flex gap-3">
          {player.championMasteries.map((mastery, index) => (
            <div
              key={mastery.champion}
              className="flex items-center gap-2 px-3 py-2 border"
              style={{ borderColor: index === 0 ? "#c9a227" : "#1a3a5c" }}
            >
              <span className="text-xl">{getChampionIcon(mastery.champion)}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: "#a0c8e0" }}>
                  {mastery.champion}
                </div>
                <div className="text-xs" style={{ color: "#c9a227" }}>
                  {formatPoints(mastery.points)} pts • M{mastery.level}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          className="px-3 py-2 border text-sm"
          style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)", color: "#a0c8e0" }}
          value={queueFilter}
          onChange={(e) => setQueueFilter(e.target.value)}
        >
          <option value="all">All Queues</option>
          <option value="Ranked Solo/Duo">Solo/Duo</option>
          <option value="Ranked Flex">Flex</option>
        </select>
        <select
          className="px-3 py-2 border text-sm"
          style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)", color: "#a0c8e0" }}
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
        >
          <option value="all">All Results</option>
          <option value="win">Victory Only</option>
          <option value="loss">Defeat Only</option>
        </select>
        <button
          onClick={onDisconnect}
          className="ml-auto px-3 py-2 border text-sm hover:bg-red-900/30"
          style={{ borderColor: "#ff3a3a", color: "#ff3a3a" }}
        >
          Disconnect
        </button>
      </div>

      {/* Match History */}
      <div className="space-y-2">
        {filteredMatches.map((match) => (
          <MatchDetailCard
            key={match.id}
            match={match}
            isExpanded={selectedMatch === match.id}
            onToggle={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
          />
        ))}
      </div>
    </div>
  );
}

function RiotConnect({ onConnect }: { onConnect: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"intro" | "searching" | "found">("intro");
  const [searchName, setSearchName] = useState("");
  const [foundPlayer, setFoundPlayer] = useState<string | null>(null);

  const handleSearch = () => {
    if (!searchName.trim()) return;
    setIsLoading(true);
    setStep("searching");

    // Simulate search
    setTimeout(() => {
      setFoundPlayer(searchName);
      setStep("found");
      setIsLoading(false);
    }, 1500);
  };

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      onConnect();
    }, 1000);
  };

  return (
    <div className="border p-6 text-center" style={{ borderColor: "#c9a227", background: "linear-gradient(135deg, rgba(201, 162, 39, 0.05) 0%, rgba(0,0,0,0.3) 100%)" }}>
      <div className="text-4xl mb-4">🎮</div>
      <h3 className="text-xl font-bold mb-2" style={{ color: "#c9a227" }}>
        Connect Your Riot Account
      </h3>
      <p className="text-sm mb-6" style={{ color: "#3a6080" }}>
        Link your League of Legends account to view match history, stats, and more — just like op.gg
      </p>

      {step === "intro" && (
        <div className="space-y-4">
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter summoner name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1 px-4 py-2 border"
              style={{
                borderColor: "#1a3a5c",
                background: "rgba(0,0,0,0.3)",
                color: "#a0c8e0",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 border font-bold"
              style={{
                borderColor: "#c9a227",
                background: "rgba(201, 162, 39, 0.2)",
                color: "#c9a227",
              }}
            >
              {isLoading ? "..." : "Search"}
            </button>
          </div>
          <p className="text-xs" style={{ color: "#3a6080" }}>
            🔍 Search for your summoner name on EUW, EUNE, NA, or other regions
          </p>
        </div>
      )}

      {step === "searching" && (
        <div className="py-8">
          <div className="animate-spin text-4xl mb-4" style={{ color: "#c9a227" }}>
            ⟳
          </div>
          <p style={{ color: "#a0c8e0" }}>Searching for &quot;{searchName}&quot;...</p>
        </div>
      )}

      {step === "found" && foundPlayer && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl"
              style={{ borderColor: "#c9a227" }}
            >
              🎮
            </div>
            <div className="text-left">
              <div className="font-bold text-lg" style={{ color: "#c9a227" }}>
                {foundPlayer}
              </div>
              <div className="text-sm" style={{ color: "#55efc4" }}>
                Diamond II • 85 LP
              </div>
            </div>
          </div>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="px-6 py-2 border font-bold"
            style={{
              borderColor: "#c9a227",
              background: "rgba(201, 162, 39, 0.3)",
              color: "#c9a227",
            }}
          >
            {isLoading ? "Connecting..." : "Connect Account"}
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t flex justify-center gap-4" style={{ borderColor: "#1a3a5c" }}>
        <span className="text-xs" style={{ color: "#3a6080" }}>
          🔒 Secure connection
        </span>
        <span className="text-xs" style={{ color: "#3a6080" }}>
          ⚡ Real-time data
        </span>
        <span className="text-xs" style={{ color: "#3a6080" }}>
          📊 Detailed stats
        </span>
      </div>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center px-3">
      <div className="text-xs mb-1" style={{ color: "#3a6080" }}>
        {label}
      </div>
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function MatchDetailCard({
  match,
  isExpanded,
  onToggle,
}: {
  match: MatchDetail;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isVictory = match.result === "VICTORY";
  const kda = `${match.kills}/${match.deaths}/${match.assists}`;

  return (
    <div
      className="border cursor-pointer transition-all hover:scale-[1.005]"
      style={{
        background: isVictory ? "rgba(85, 239, 196, 0.05)" : "rgba(255, 58, 58, 0.05)",
        borderColor: isVictory ? "#55efc4" : "#ff3a3a",
      }}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between p-3">
        {/* Left side - Champion & Result */}
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded flex items-center justify-center text-3xl"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            {match.championIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: isVictory ? "#55efc4" : "#ff3a3a" }}>
                {match.result}
              </span>
              <span
                className="px-2 py-0.5 text-[10px]"
                style={{ background: "rgba(0,0,0,0.3)", color: "#3a6080" }}
              >
                {match.queue}
              </span>
            </div>
            <div className="text-sm" style={{ color: "#a0c8e0" }}>
              {match.champion} vs {match.opponent}
            </div>
          </div>
        </div>

        {/* Center - Stats */}
        <div className="flex items-center gap-6">
          <StatBox label="KDA" value={kda} color="#f39c12" />
          <StatBox label="CS" value={match.cs.toString()} color="#a0c8e0" />
          <StatBox label="CS/M" value={match.csPerMin.toString()} color="#3498db" />
          <StatBox label="TIME" value={match.duration} color="#a0c8e0" />
        </div>

        {/* Right side - LP & Expand */}
        <div className="flex items-center gap-3">
          <div
            className="px-3 py-1 font-bold"
            style={{
              background: "rgba(0,0,0,0.3)",
              color: isVictory ? "#55efc4" : "#ff3a3a",
            }}
          >
            {isVictory ? "+" : ""}
            {match.lpChange} LP
          </div>
          <span style={{ color: "#3a6080" }}>{isExpanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t p-4" style={{ borderColor: "#1a3a5c" }}>
          <div className="grid grid-cols-4 gap-4">
            {/* Items */}
            <div>
              <div className="text-[10px] mb-2" style={{ color: "#3a6080" }}>
                ITEMS
              </div>
              <div className="flex gap-1">
                {match.items.slice(0, 6).map((item, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 border flex items-center justify-center text-sm"
                    style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
                  >
                    📦
                  </div>
                ))}
                <div
                  className="w-8 h-8 border flex items-center justify-center text-sm"
                  style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
                >
                  👢
                </div>
              </div>
            </div>

            {/* Spells */}
            <div>
              <div className="text-[10px] mb-2" style={{ color: "#3a6080" }}>
                SPELLS
              </div>
              <div className="flex gap-1">
                {match.spells.map((spell, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 border flex items-center justify-center text-sm"
                    style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            </div>

            {/* Damage */}
            <div>
              <div className="text-[10px] mb-1" style={{ color: "#3a6080" }}>
                DAMAGE
              </div>
              <div className="text-sm" style={{ color: "#ff6b6b" }}>
                🔥 24,567
              </div>
              <div className="text-xs" style={{ color: "#3a6080" }}>
                12,345 to champions
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="text-[10px] mb-1" style={{ color: "#3a6080" }}>
                TIMELINE
              </div>
              <div className="text-xs" style={{ color: "#a0c8e0" }}>
                {match.timestamp}
              </div>
              <div className="text-xs" style={{ color: "#3a6080" }}>
                2 kills in lane
              </div>
            </div>
          </div>

          {/* Additional stats row */}
          <div className="mt-4 pt-3 border-t flex gap-8" style={{ borderColor: "#1a3a5c" }}>
            <div>
              <span className="text-[10px]" style={{ color: "#3a6080" }}>KILL PARTICIPATION </span>
              <span className="text-sm font-bold" style={{ color: "#f39c12" }}>65%</span>
            </div>
            <div>
              <span className="text-[10px]" style={{ color: "#3a6080" }}>VISION SCORE </span>
              <span className="text-sm font-bold" style={{ color: "#3498db" }}>28</span>
            </div>
            <div>
              <span className="text-[10px]" style={{ color: "#3a6080" }}>CC SCORE </span>
              <span className="text-sm font-bold" style={{ color: "#9b59b6" }}>42</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px]" style={{ color: "#3a6080" }}>
        {label}
      </div>
    </div>
  );
}

function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    IRON: "#434343",
    BRONZE: "#cd7f32",
    SILVER: "#c0c0c0",
    GOLD: "#ffd700",
    PLATINUM: "#00CED1",
    DIAMOND: "#b9f2ff",
    MASTER: "#9b59b6",
    GRANDMASTER: "#e74c3c",
    CHALLENGER: "#f39c12",
  };
  return colors[tier] || "#434343";
}

function getChampionIcon(champion: string): string {
  const icons: Record<string, string> = {
    Ahri: "🦊",
    Jinx: "💣",
    Thresh: "⛓️",
    Zed: "🗡️",
    Yasuo: "🌪️",
  };
  return icons[champion] || "🎮";
}

function formatPoints(points: number): string {
  if (points >= 1000000) {
    return (points / 1000000).toFixed(1) + "M";
  }
  if (points >= 1000) {
    return (points / 1000).toFixed(0) + "K";
  }
  return points.toString();
}
