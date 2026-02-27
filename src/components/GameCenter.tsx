"use client";

import { useState, useEffect } from "react";
import RiotProfile from "./RiotProfile";

// Game types available
const GAMES = [
  { id: "lol", name: "LEAGUE OF LEGENDS", icon: "⚔️", type: "RANKED" },
  { id: "val", name: "VALORANT", icon: "🎯", type: "COMPETITIVE" },
  { id: "csgo", name: "CS2", icon: "🔫", type: "MM" },
  { id: "apex", name: "APEX LEGENDS", icon: "🏆", type: "RANKED" },
  { id: "fortnite", icon: "🎮", name: "FORTNITE", type: "BR" },
  { id: "minecraft", icon: "⛏️", name: "MINECRAFT", type: "SURVIVAL" },
];

// Sample match history data for League of Legends
const MOCK_MATCH_HISTORY = [
  {
    id: 1,
    champion: "Ahri",
    championIcon: "🦊",
    result: "VICTORY",
    kda: "9/3/7",
    cs: 187,
    duration: "32:15",
    queue: "Ranked Solo",
    rank: "Diamond II",
    lp: 45,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    champion: "Yasuo",
    championIcon: "🌪️",
    result: "DEFEAT",
    kda: "5/8/4",
    cs: 142,
    duration: "28:44",
    queue: "Ranked Solo",
    rank: "Diamond II",
    lp: -15,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    champion: "Jinx",
    championIcon: "💣",
    result: "VICTORY",
    kda: "12/2/9",
    cs: 234,
    duration: "35:22",
    queue: "Ranked Flex",
    rank: "Diamond II",
    lp: 22,
    timestamp: "Yesterday",
  },
  {
    id: 4,
    champion: "Thresh",
    championIcon: "⛓️",
    result: "VICTORY",
    kda: "2/4/15",
    cs: 45,
    duration: "29:18",
    queue: "Ranked Solo",
    rank: "Diamond II",
    lp: 18,
    timestamp: "Yesterday",
  },
  {
    id: 5,
    champion: "Zed",
    championIcon: "🗡️",
    result: "DEFEAT",
    kda: "7/6/3",
    cs: 156,
    duration: "24:55",
    queue: "Ranked Solo",
    rank: "Diamond II",
    lp: -20,
    timestamp: "2 days ago",
  },
];

// Experience levels
const LEVELS = [
  { level: 1, xp: 0, title: "Newcomer" },
  { level: 2, xp: 100, title: "Rookie" },
  { level: 3, xp: 300, title: "Player" },
  { level: 4, xp: 600, title: "Veteran" },
  { level: 5, xp: 1000, title: "Pro" },
  { level: 6, xp: 1500, title: "Elite" },
  { level: 7, xp: 2100, title: "Master" },
  { level: 8, xp: 2800, title: "Grandmaster" },
  { level: 9, xp: 3600, title: "Legend" },
  { level: 10, xp: 4500, title: "Immortal" },
];

export default function GameCenter() {
  const [selectedGame, setSelectedGame] = useState("lol");
  const [activeTab, setActiveTab] = useState<"profile" | "matches" | "stats" | "ranking">("profile");
  const [userXP, setUserXP] = useState(1250);
  const [userLevel, setUserLevel] = useState(6);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [riotConnected, setRiotConnected] = useState(false);

  // Calculate XP progress to next level
  const currentLevel = LEVELS.find((l) => l.level === userLevel)!;
  const nextLevel = LEVELS.find((l) => l.level === userLevel + 1);
  const xpProgress = nextLevel
    ? ((userXP - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100
    : 100;

  const wins = MOCK_MATCH_HISTORY.filter((m) => m.result === "VICTORY").length;
  const losses = MOCK_MATCH_HISTORY.filter((m) => m.result === "DEFEAT").length;
  const winRate = Math.round((wins / MOCK_MATCH_HISTORY.length) * 100);

  return (
    <section className="border-b" style={{ borderColor: "var(--necrom-border)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
          <div
            className="text-xs tracking-[0.4em] px-4 py-1 border"
            style={{ color: "#9b59b6", borderColor: "#1a3a5c" }}
          >
            GAME CENTER
          </div>
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
        </div>

        {/* XP & Level Display - Hidden on Profile tab */}
        {activeTab !== "profile" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Level badge */}
            <div
              className="relative w-16 h-16 rounded-full border-2 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                borderColor: "#9b59b6",
                boxShadow: "0 0 20px rgba(155, 89, 182, 0.4)",
              }}
            >
              <div className="text-2xl font-bold" style={{ color: "#9b59b6" }}>
                {userLevel}
              </div>
              <div
                className="absolute -bottom-2 px-2 py-0.5 text-[10px] font-bold"
                style={{ background: "#9b59b6", color: "#000" }}
              >
                {currentLevel.title}
              </div>
            </div>

            {/* XP Bar */}
            <div className="w-48">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "#9b59b6" }}>XP</span>
                <span style={{ color: "#a0c8e0" }}>
                  {userXP} / {nextLevel?.xp || "MAX"}
                </span>
              </div>
              <div
                className="h-3 border"
                style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${xpProgress}%`,
                    background: "linear-gradient(90deg, #9b59b6, #e74c3c)",
                    boxShadow: "0 0 10px rgba(155, 89, 182, 0.5)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats summary */}
          <div className="flex gap-4">
            <StatBox label="WINS" value={wins.toString()} color="#55efc4" />
            <StatBox label="LOSSES" value={losses.toString()} color="#ff3a3a" />
            <StatBox label="WIN RATE" value={`${winRate}%`} color="#f39c12" />
          </div>
        </div>
        )}

        {/* Game Selector - Hidden on Profile tab */}
        {activeTab !== "profile" && (
          <div className="flex flex-wrap gap-2 mb-6">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="px-4 py-2 border transition-all hover:scale-105"
              style={{
                background:
                  selectedGame === game.id
                    ? "rgba(155, 89, 182, 0.2)"
                    : "rgba(0,0,0,0.3)",
                borderColor: selectedGame === game.id ? "#9b59b6" : "#1a3a5c",
                boxShadow:
                  selectedGame === game.id
                    ? "0 0 15px rgba(155, 89, 182, 0.3)"
                    : "none",
              }}
            >
              <span className="mr-2">{game.icon}</span>
              <span
                className="text-xs tracking-wider"
                style={{
                  color: selectedGame === game.id ? "#9b59b6" : "#3a6080",
                }}
              >
                {game.name}
              </span>
              <span
                className="ml-2 text-[10px] px-1.5 py-0.5"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  color: "#3a6080",
                }}
              >
                {game.type}
              </span>
            </button>
          ))}
        </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("profile")}
            className="px-4 py-2 border text-xs tracking-wider uppercase transition-all"
            style={{
              background:
                activeTab === "profile" ? "rgba(201, 162, 39, 0.2)" : "rgba(0,0,0,0.3)",
              borderColor: activeTab === "profile" ? "#c9a227" : "#1a3a5c",
              color: activeTab === "profile" ? "#c9a227" : "#3a6080",
            }}
          >
            👤 PROFILE
          </button>
          {(["matches", "stats", "ranking"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 border text-xs tracking-wider uppercase transition-all"
              style={{
                background:
                  activeTab === tab ? "rgba(155, 89, 182, 0.2)" : "rgba(0,0,0,0.3)",
                borderColor: activeTab === tab ? "#9b59b6" : "#1a3a5c",
                color: activeTab === tab ? "#9b59b6" : "#3a6080",
              }}
            >
              {tab === "matches" && "📋 "}
              {tab === "stats" && "📊 "}
              {tab === "ranking" && "🏆 "}
              {tab}
            </button>
          ))}
        </div>

        {/* Riot Profile Tab */}
        {activeTab === "profile" && (
          <RiotProfile
            isConnected={riotConnected}
            onConnect={() => setRiotConnected(true)}
            onDisconnect={() => setRiotConnected(false)}
          />
        )}

        {/* Match History */}
        {activeTab === "matches" && (
          <div className="space-y-2">
            {MOCK_MATCH_HISTORY.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                isExpanded={showDetails === match.id}
                onToggle={() => setShowDetails(showDetails === match.id ? null : match.id)}
              />
            ))}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Matches"
              value="1,247"
              icon="🎮"
              trend="+12%"
              color="#9b59b6"
            />
            <StatCard
              title="Hours Played"
              value="892"
              icon="⏱️"
              trend="+5%"
              color="#3498db"
            />
            <StatCard
              title="Win Rate"
              value="58.3%"
              icon="📈"
              trend="+2.1%"
              color="#2ecc71"
            />
            <StatCard
              title="Avg KDA"
              value="4.2"
              icon="💀"
              trend="+0.3"
              color="#e74c3c"
            />
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === "ranking" && (
          <div className="space-y-2">
            <RankingCard
              rank={1}
              player="ShadowSlayer99"
              lp={2450}
              winRate={67}
              mains={["Ahri", "Zed", "Yasuo"]}
              isUser={false}
            />
            <RankingCard
              rank={2}
              player="NightStalker"
              lp={2387}
              winRate={62}
              mains={["Thresh", "Leona", "Braum"]}
              isUser={false}
            />
            <RankingCard
              rank={3}
              player="CyberNinja"
              lp={2291}
              winRate={59}
              mains={["Jinx", "Kai'Sa", "Aphelios"]}
              isUser={false}
            />
            <RankingCard
              rank={4}
              player="NeoOperator"
              lp={1845}
              winRate={58}
              mains={["Ahri", "Jinx", "Thresh"]}
              isUser={true}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border px-3 py-2" style={{ borderColor: "#1a3a5c" }}>
      <div className="text-[10px] tracking-wider" style={{ color: "#3a6080" }}>
        {label}
      </div>
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  isExpanded,
  onToggle,
}: {
  match: (typeof MOCK_MATCH_HISTORY)[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isVictory = match.result === "VICTORY";

  return (
    <div
      className="border cursor-pointer transition-all hover:scale-[1.01]"
      style={{
        background: isVictory ? "rgba(85, 239, 196, 0.05)" : "rgba(255, 58, 58, 0.05)",
        borderColor: isVictory ? "#55efc4" : "#ff3a3a",
      }}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between p-3">
        {/* Champion & Result */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded flex items-center justify-center text-2xl"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            {match.championIcon}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: isVictory ? "#55efc4" : "#ff3a3a" }}>
              {match.result}
            </div>
            <div className="text-xs" style={{ color: "#a0c8e0" }}>
              {match.champion} • {match.queue}
            </div>
          </div>
        </div>

        {/* KDA & CS */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold" style={{ color: "#f39c12" }}>
              {match.kda}
            </div>
            <div className="text-[10px]" style={{ color: "#3a6080" }}>
              KDA
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm" style={{ color: "#a0c8e0" }}>
              {match.cs}
            </div>
            <div className="text-[10px]" style={{ color: "#3a6080" }}>
              CS
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm" style={{ color: "#a0c8e0" }}>
              {match.duration}
            </div>
            <div className="text-[10px]" style={{ color: "#3a6080" }}>
              TIME
            </div>
          </div>
          <div
            className={`px-2 py-1 text-xs font-bold ${isVictory ? "text-[#55efc4]" : "text-[#ff3a3a]"}`}
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            {isVictory ? "+" : ""}
            {match.lp} LP
          </div>
          <span style={{ color: "#3a6080" }}>{isExpanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div
          className="border-t p-4 grid grid-cols-4 gap-4"
          style={{ borderColor: "#1a3a5c" }}
        >
          <div>
            <div className="text-[10px]" style={{ color: "#3a6080" }}>
              CHAMPION
            </div>
            <div className="text-sm" style={{ color: "#a0c8e0" }}>
              {match.champion}
            </div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: "#3a6080" }}>
              RANK
            </div>
            <div className="text-sm" style={{ color: "#a0c8e0" }}>
              {match.rank}
            </div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: "#3a6080" }}>
              QUEUE
            </div>
            <div className="text-sm" style={{ color: "#a0c8e0" }}>
              {match.queue}
            </div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: "#3a6080" }}>
              PLAYED
            </div>
            <div className="text-sm" style={{ color: "#a0c8e0" }}>
              {match.timestamp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="necrom-panel p-4" style={{ borderColor: "#1a3a5c" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs font-bold"
          style={{ color: trend.startsWith("+") ? "#55efc4" : "#ff3a3a" }}
        >
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "#3a6080" }}>
        {title}
      </div>
    </div>
  );
}

function RankingCard({
  rank,
  player,
  lp,
  winRate,
  mains,
  isUser,
}: {
  rank: number;
  player: string;
  lp: number;
  winRate: number;
  mains: string[];
  isUser: boolean;
}) {
  const getRankColor = (r: number) => {
    if (r === 1) return "#f1c40f";
    if (r === 2) return "#bdc3c7";
    if (r === 3) return "#cd6133";
    return "#3a6080";
  };

  return (
    <div
      className="border p-4 flex items-center justify-between"
      style={{
        background: isUser ? "rgba(155, 89, 182, 0.1)" : "rgba(0,0,0,0.2)",
        borderColor: isUser ? "#9b59b6" : "#1a3a5c",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded flex items-center justify-center text-lg font-bold"
          style={{
            background: "rgba(0,0,0,0.3)",
            color: getRankColor(rank),
          }}
        >
          #{rank}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="font-bold"
              style={{ color: isUser ? "#9b59b6" : "#a0c8e0" }}
            >
              {player}
            </span>
            {isUser && (
              <span
                className="text-[10px] px-1.5 py-0.5"
                style={{ background: "#9b59b6", color: "#000" }}
              >
                YOU
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-1">
            {mains.map((champ) => (
              <span
                key={champ}
                className="text-[10px] px-1.5 py-0.5"
                style={{ background: "rgba(0,0,0,0.3)", color: "#3a6080" }}
              >
                {champ}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: "#f39c12" }}>
            {lp} LP
          </div>
          <div className="text-[10px]" style={{ color: "#3a6080" }}>
            MMR
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-lg font-bold"
            style={{ color: winRate >= 50 ? "#55efc4" : "#ff3a3a" }}
          >
            {winRate}%
          </div>
          <div className="text-[10px]" style={{ color: "#3a6080" }}>
            WIN RATE
          </div>
        </div>
      </div>
    </div>
  );
}
