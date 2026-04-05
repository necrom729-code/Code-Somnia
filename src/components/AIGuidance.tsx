"use client";

import { useState, useEffect, useRef } from "react";

interface Question {
  id: number;
  question: string;
  options: { label: string; response: string }[];
}

const defaultQuestions: Question[] = [
  {
    id: 1,
    question: "NEED HELP WITH FILES?",
    options: [
      { label: "UPLOAD", response: "Drag files onto the drop zone or click the upload button. Max size 100MB per file." },
      { label: "DOWNLOAD", response: "Click any file to preview, then use the download button in the preview modal." },
      { label: "ORGANIZE", response: "Create folders to group files. Click the + button next to Folders to create new ones." },
    ],
  },
  {
    id: 2,
    question: "SEARCHING FOR SOMETHING?",
    options: [
      { label: "BY NAME", response: "Type in the search bar. Results filter in real-time as you type." },
      { label: "BY TYPE", response: "Use the filter dropdown to show only documents, videos, images, etc." },
      { label: "BY DATE", response: "Sort by modified date. Click the column header in list view." },
    ],
  },
  {
    id: 3,
    question: "SECURITY CONCERNS?",
    options: [
      { label: "PROTECT DATA", response: "Enable all protections in the Security Control Center. VPN encrypts your connection." },
      { label: "BACKUP", response: "Go to Security > Backups to create restore points. Recommended weekly." },
      { label: "PRIVACY", response: "Disable tracking in Privacy settings. Your data stays local." },
    ],
  },
  {
    id: 4,
    question: "STORAGE FULL?",
    options: [
      { label: "CHECK USAGE", response: "View storage in the dashboard. Shows used/total with breakdown by file type." },
      { label: "FREE SPACE", response: "Delete unused files or old backups. Create more space instantly." },
      { label: "GET MORE", response: "Upgrade in Settings > Storage. Plans start at 100GB." },
    ],
  },
  {
    id: 5,
    question: "CHANGE APPEARANCE?",
    options: [
      { label: "THEME", response: "Go to Settings > Appearance. Choose Cyberpunk, Matrix, Blood, Ghost, or Neon." },
      { label: "LANGUAGE", response: "Click the globe icon in nav. 8 languages available." },
      { label: "AVATAR", response: "Go to Settings > Profile to change your icon." },
    ],
  },
];

export default function AIGuidance({ questions = defaultQuestions }: { questions?: Question[] }) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentQ, setCurrentQ] = useState<Question>(questions[0]);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mode, setMode] = useState<"idle" | "question" | "response">("question");
  const [eyeGlow, setEyeGlow] = useState<"idle" | "angry" | "furious" | "warning">("idle");
  const [jawState, setJawState] = useState<"closed" | "open" | "snarl">("closed");
  const [floatingY, setFloatingY] = useState(0);
  const [wobble, setWobble] = useState(0);
  const [showSteam, setShowSteam] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingY(Math.sin(Date.now() / 600) * 4);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && mode === "idle") {
        setWobble(Math.sin(Date.now() / 400) * 5);
      } else {
        setWobble(0);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isHovered, mode]);

  useEffect(() => {
    if (mode === "question" && !isTyping && displayText === "") {
      typeQuestion(currentQ.question);
    }
  }, [mode, currentQ]);

  useEffect(() => {
    if (mode === "response" && !isTyping && selectedResponse) {
      typeResponse(selectedResponse);
    }
  }, [mode, selectedResponse]);

  const typeQuestion = (text: string) => {
    setIsTyping(true);
    setEyeGlow("warning");
    setJawState("closed");
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setShowOptions(true);
        setEyeGlow("idle");
      }
    }, 40);
  };

  const typeResponse = (text: string) => {
    setIsTyping(true);
    setEyeGlow("angry");
    setJawState("snarl");
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setEyeGlow("idle");
        setJawState("closed");
        setTimeout(() => {
          setSelectedResponse(null);
          setShowOptions(false);
          setDisplayText("");
          setMode("idle");
          nextQuestion();
        }, 5000);
      }
    }, 30);
  };

  const nextQuestion = () => {
    setTimeout(() => {
      setCurrentQ(questions[(questions.indexOf(currentQ) + 1) % questions.length]);
      setMode("question");
    }, 2000);
  };

  const handleOptionClick = (option: { label: string; response: string }) => {
    setSelectedResponse(option.response);
    setShowOptions(false);
    setMode("response");
  };

  const handleHover = () => {
    setIsHovered(true);
    setEyeGlow("furious");
    setShowSteam(true);
    setMode("question");
  };

  const handleLeave = () => {
    setIsHovered(false);
    setEyeGlow("idle");
    setShowSteam(false);
  };

  const eyeColor = eyeGlow === "idle" ? "#ff0000" : eyeGlow === "angry" ? "#ff3300" : eyeGlow === "furious" ? "#ff0066" : "#ffff00";
  const glowIntensity = eyeGlow === "idle" ? 15 : eyeGlow === "angry" ? 25 : eyeGlow === "furious" ? 35 : 20;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full border transition-all duration-300 hover:scale-110"
        style={{ background: "rgba(20, 0, 0, 0.95)", borderColor: "#ff0000", boxShadow: "0 0 25px rgba(255, 0, 0, 0.4)" }}
      >
        <svg viewBox="0 0 80 100" className="w-8 h-10" fill="none">
          <ellipse cx="40" cy="50" rx="30" ry="35" fill="#0a0000" stroke="#ff0000" strokeWidth="2"/>
          <ellipse cx="25" cy="45" rx="10" ry="12" fill="#000" stroke="#ff0000" strokeWidth="2"/>
          <ellipse cx="55" cy="45" rx="10" ry="12" fill="#000" stroke="#ff0000" strokeWidth="2"/>
          <ellipse cx="25" cy="45" r="5" fill="#ff0000" style={{ filter: "drop-shadow(0 0 8px #ff0000)" }}/>
          <ellipse cx="55" cy="45" r="5" fill="#ff0000" style={{ filter: "drop-shadow(0 0 8px #ff0000)" }}/>
          <path d="M 25 75 Q 40 80 55 75" stroke="#ff0000" strokeWidth="2" fill="none"/>
        </svg>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      style={{
        transform: `translateY(${floatingY}px) rotate(${wobble}deg)`,
        transition: "transform 0.1s ease",
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="absolute bottom-full right-16 mb-4 w-72" style={{ transform: isHovered ? "scale(1)" : "scale(0.95)", transition: "transform 0.3s" }}>
        <div className="p-4 rounded-lg border" style={{ 
          background: "rgba(30, 0, 0, 0.95)", 
          borderColor: "#ff0000",
          boxShadow: "0 0 40px rgba(255, 0, 0, 0.3), inset 0 0 30px rgba(255, 0, 0, 0.1)",
        }}>
          <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "#ff3333", textShadow: "0 0 10px #ff0000" }}>
            {isTyping && <span className="animate-pulse mr-1">▊</span>}
            {displayText}
          </div>

          {showOptions && (
            <div className="mt-3 grid gap-2">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="text-xs py-2 px-3 border transition-all duration-200 hover:bg-red-900/30"
                  style={{ 
                    borderColor: "#660000", 
                    color: "#ff6666",
                    textShadow: "0 0 5px #ff0000",
                    animation: `fadeIn 0.3s ease ${i * 0.1}s forwards`,
                    opacity: 0,
                  }}
                >
                  [{opt.label}]
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <svg viewBox="0 0 100 130" width="90" height="120" style={{ filter: `drop-shadow(0 0 ${glowIntensity}px ${eyeColor})`, transition: "filter 0.2s" }}>
        <ellipse cx="50" cy="65" rx="40" ry="50" fill="#0a0000" stroke="#ff0000" strokeWidth="2.5"/>
        
        <path d="M 15 30 Q 50 5 85 30 L 80 45 Q 50 35 20 45 Z" fill="#0f0505" stroke="#ff0000" strokeWidth="1.5"/>
        
        <path d="M 10 50 Q 15 35 25 30" stroke="#ff0000" strokeWidth="1" fill="none" opacity="0.5"/>
        <path d="M 90 50 Q 85 35 75 30" stroke="#ff0000" strokeWidth="1" fill="none" opacity="0.5"/>
        
        <ellipse cx="30" cy="55" rx="12" ry="14" fill="#000" stroke="#ff0000" strokeWidth="2"/>
        <ellipse cx="70" cy="55" rx="12" ry="14" fill="#000" stroke="#ff0000" strokeWidth="2"/>
        
        <ellipse cx="30" cy="55" r="7" ry="10" fill={eyeColor} style={{ filter: `drop-shadow(0 0 ${isTyping ? 15 : 10}px ${eyeColor})` }}/>
        <ellipse cx="70" cy="55" r="7" ry="10" fill={eyeColor} style={{ filter: `drop-shadow(0 0 ${isTyping ? 15 : 10}px ${eyeColor})` }}/>
        
        {eyeGlow === "furious" && (
          <>
            <path d="M 18 50 L 28 53" stroke="#ff0000" strokeWidth="2"/>
            <path d="M 82 50 L 72 53" stroke="#ff0000" strokeWidth="2"/>
          </>
        )}
        
        <path d="M 50 75 L 45 90 L 55 90 Z" fill="#050000" stroke="#ff0000" strokeWidth="1.5"/>
        
        {jawState === "closed" && (
          <path d="M 25 100 Q 50 108 75 100" stroke="#ff0000" strokeWidth="2.5" fill="none"/>
        )}
        {jawState === "snarl" && (
          <>
            <path d="M 20 95 Q 50 115 80 95" stroke="#ff0000" strokeWidth="2.5" fill="none" style={{ filter: "drop-shadow(0 0 3px #ff0000)" }}/>
            <path d="M 30 102 Q 50 108 70 102" stroke="#330000" strokeWidth="1" fill="none"/>
          </>
        )}
        {jawState === "open" && (
          <ellipse cx="50" cy="102" rx="15" ry="12" fill="#000" stroke="#ff0000" strokeWidth="1.5"/>
        )}
        
        <line x1="32" y1="112" x2="32" y2="125" stroke="#ff0000" strokeWidth="2"/>
        <line x1="42" y1="112" x2="42" y2="125" stroke="#ff0000" strokeWidth="2"/>
        <line x1="50" y1="112" x2="50" y2="125" stroke="#ff0000" strokeWidth="2"/>
        <line x1="58" y1="112" x2="58" y2="125" stroke="#ff0000" strokeWidth="2"/>
        <line x1="68" y1="112" x2="68" y2="125" stroke="#ff0000" strokeWidth="2"/>
        
        <circle cx="15" cy="40" r="2" fill="#ff0000" opacity="0.6"/>
        <circle cx="85" cy="40" r="2" fill="#ff0000" opacity="0.6"/>
        <circle cx="25" cy="25" r="1.5" fill="#ff0000" opacity="0.4"/>
        <circle cx="75" cy="25" r="1.5" fill="#ff0000" opacity="0.4"/>
      </svg>

      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ background: eyeColor, boxShadow: `0 0 10px ${eyeColor}` }}/>
    </div>
  );
}