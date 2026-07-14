/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import FactionBrowser from "./components/FactionBrowser";
import ArmyBuilder from "./components/ArmyBuilder";
import GameCompanion from "./components/GameCompanion";
import RulesSage from "./components/RulesSage";
import NewPlayerAcademy from "./components/NewPlayerAcademy";
import { 
  BookOpen, Swords, Hammer, HelpCircle, Shield, 
  Sparkles, Flame, User, Info, Trophy, GraduationCap,
  ChevronLeft, ChevronRight, Menu, X
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"codex" | "builder" | "companion" | "sage" | "academy">("academy");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar_collapsed", String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  interface NavItem {
    id: "codex" | "builder" | "companion" | "sage" | "academy";
    label: string;
    short: string;
    icon: React.ComponentType<any>;
    desc: string;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { 
      id: "academy", 
      label: "Recruit Academy", 
      short: "Academy",
      icon: GraduationCap, 
      desc: "Rules & Combat Simulator",
      badge: "START"
    },
    { 
      id: "codex", 
      label: "Codex Vault", 
      short: "Codex",
      icon: BookOpen, 
      desc: "Factions & Points Registry" 
    },
    { 
      id: "builder", 
      label: "Army Builder", 
      short: "Builder",
      icon: Hammer, 
      desc: "Strike Force Lists" 
    },
    { 
      id: "companion", 
      label: "Battle Companion", 
      short: "Companion",
      icon: Swords, 
      desc: "Scoring & Turn Tracker" 
    },
    { 
      id: "sage", 
      label: "Rules Sage", 
      short: "Sage",
      icon: Sparkles, 
      desc: "Cognitive AI Rules Assistant",
      badge: "AI"
    },
  ];

  const onboardingSlides = [
    {
      title: "Welcome, Recruit! ⚔️",
      description: "Step into the ultimate Warhammer 40k tabletop recruit system. This interactive assistant is custom-made to take you from hobby novice to victorious commander. Learn faction lore, build compliant army lists, log score rounds, and consult our rules engine seamlessly.",
      accent: "The galaxy is vast and dark. Prepare yourself!"
    },
    {
      title: "1. 10th Ed Codex & Quizzes 📚",
      description: "Not sure who to play? Take our 2-Minute Playstyle Quiz to match with your ideal faction (Space Marines, Necrons, Tyranids, or Aeldari). Browse unit datasheets, points values, weapon ranges, and tap on special weapon keywords to instantly read detailed explanations.",
      accent: "Tip: Tap 'Hobbyist Corner' in Codex cards for beginner-friendly paint schemes!"
    },
    {
      title: "2. Strike Force List Builder 🛠️",
      description: "Assemble custom squads, attach genetic characters, choose heavy tanks or swarm warriors, and calculate points on the fly. This builder enforces roster restrictions (Warlords, point size limits) and suggests strategic relics/enhancements.",
      accent: "Rules enforced: You always need exactly one designated WARLORD model."
    },
    {
      title: "3. Battle Companion & Checklist ⏱️",
      description: "Ready for the table? Our Game Companion walks you through pre-game boards, deployment limits, interactive terrain guidelines, and round scoreboards. Plus, use our step-by-step Turn Phase checklist and Combat Math Simulator to roll dice with confident precision.",
      accent: "Live Math: The Dice Probability gauge computes exact statistical outcomes instantly."
    }
  ];

  return (
    <div className="min-h-screen bg-grim-dark text-stone-200 flex flex-col lg:flex-row font-sans selection:bg-amber-500/30 selection:text-amber-200 grimdark-grid" id="app-root">
      
      {/* 1. Desktop Left Sidebar Navigation */}
      <aside 
        className={`hidden lg:flex flex-col bg-grim-card/95 border-r border-grim-border h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out select-none backdrop-blur-md ${
          isSidebarCollapsed ? "w-20" : "w-72"
        }`} 
        id="desktop-sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between border-b border-grim-border/80 h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-amber-500/10 blur-md rounded-full" />
              <div className="relative bg-grim-dark/80 p-2 border border-amber-600/30 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col transition-all duration-300">
                <h1 className="text-xs font-black tracking-widest uppercase font-display text-stone-100 flex items-center gap-1">
                  <span>WARHAMMER 40K</span>
                </h1>
                <span className="text-[8px] text-amber-500 font-mono tracking-widest uppercase mt-0.5 font-bold">
                  RECRUIT STRATEGIUM
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-stone-800/40 text-stone-400 hover:text-stone-100 transition cursor-pointer"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto" id="sidebar-nav-list">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-lg text-left transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-amber-500/8 border-l-2 border-amber-500 text-stone-100 shadow-amber-glow" 
                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-900/60 border-l-2 border-transparent"
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-amber-400" : "text-stone-400 group-hover:text-stone-200"
                }`} />
                
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-bold tracking-wider font-display uppercase">{item.label}</span>
                      {item.badge && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono font-bold uppercase tracking-normal shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 font-mono truncate mt-0.5 group-hover:text-stone-400 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                )}

                {isSidebarCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-grim-card" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-grim-border/80 bg-stone-950/20">
          {!isSidebarCollapsed ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setOnboardingStep(0);
                  setShowOnboarding(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/25 py-2.5 rounded-lg text-xs font-black transition cursor-pointer font-mono uppercase tracking-widest shadow-sm hover:shadow-amber-glow"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Tactical Briefing</span>
              </button>
              <div className="text-[8px] font-mono text-stone-600 uppercase text-center tracking-widest">
                COGNITIVE HUB // v1.2.0
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setOnboardingStep(0);
                setShowOnboarding(true);
              }}
              className="w-full flex items-center justify-center bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 p-2.5 rounded-lg transition cursor-pointer"
              title="Open Tactical Briefing"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Main Area for Workspace (incorporates top nav bar and main layout content) */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0" id="main-viewport-container">
        
        {/* Top Navbar Header */}
        <header 
          className="bg-grim-card/90 border-b border-grim-border/80 sticky top-0 z-40 backdrop-blur-md h-16 flex items-center px-4 lg:px-6 justify-between select-none" 
          id="main-top-navbar"
        >
          {/* Left part: Breadcrumbs on desktop, Logo on mobile */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <div className="bg-grim-dark p-1.5 border border-amber-600/30 rounded-md">
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <h1 className="text-xs font-black tracking-wider uppercase font-display text-stone-100">
                WARHAMMER 40K
              </h1>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-widest text-stone-500 uppercase">
              <span>COG STRATEGIUM</span>
              <span>/</span>
              <span className="text-amber-500 font-bold">
                {navItems.find(item => item.id === activeTab)?.label}
              </span>
            </div>
          </div>

          {/* Right part: Action buttons */}
          <div className="flex items-center gap-3">
            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-stone-900/60 border border-grim-border px-3 py-1.5 rounded-full text-[9px] font-mono tracking-widest text-stone-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>COGNITIVE LINK ACTIVE</span>
            </div>

            {/* Mobile/Tablet Tactical Briefing Button */}
            <button
              onClick={() => {
                setOnboardingStep(0);
                setShowOnboarding(true);
              }}
              className="lg:hidden flex items-center justify-center bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 px-3 py-2 rounded-lg text-[10px] font-black border border-amber-500/20 active:scale-95 transition cursor-pointer font-mono uppercase tracking-wider"
              title="Open Tactical Briefing"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              <span>Briefing</span>
            </button>
          </div>
        </header>

        {/* 3. Main Screen Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12" id="main-content-viewport">
          
          {/* Main Title Section */}
          <div className="mb-6 lg:mb-8 animate-fade-in" id="viewport-title-block">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-amber-500 uppercase font-bold mb-1">
              <span>TACTICAL MODULE CONSOLE</span>
              <span>&bull;</span>
              <span>10TH EDITION COMPANION</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-stone-100 tracking-wider font-display uppercase">
              {navItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-xs lg:text-sm text-stone-400 tracking-wide mt-1 leading-relaxed max-w-3xl">
              {activeTab === "academy" && "Explore comprehensive guides, interact with combat simulators, find your strategic faction alignment, and access beginner hobby resources."}
              {activeTab === "codex" && "Review 10th Edition army regulations, unit datasheets, specific weaponry keywords, and active point costs."}
              {activeTab === "builder" && "Draft structured lists of customized squads, evaluate points allocations, enforce roster rules, and download strategic exports."}
              {activeTab === "companion" && "Track turn-by-turn round checkers, manage points tally board, roll tactical dice calculators, and assess battlefield layouts."}
              {activeTab === "sage" && "Query our imperial records system powered by Gemini AI. Ask questions about rules scenarios, phase mechanics, and specific faction matches."}
            </p>
            <div className="h-px bg-gradient-to-r from-amber-500/20 via-grim-border to-transparent mt-4" />
          </div>

          {/* Active View Rendering */}
          <div className="animate-slide-up" key={activeTab}>
            {activeTab === "academy" && <NewPlayerAcademy />}
            {activeTab === "codex" && <FactionBrowser />}
            {activeTab === "builder" && <ArmyBuilder />}
            {activeTab === "companion" && <GameCompanion />}
            {activeTab === "sage" && <RulesSage />}
          </div>
        </main>

        {/* 4. Desktop Footer */}
        <footer className="hidden lg:block bg-grim-card border-t border-grim-border py-6 text-center font-mono text-[9px] text-stone-600 mt-auto select-none" id="app-footer">
          <p className="tracking-widest uppercase">THIS IS AN UNOFFICIAL WARHAMMER 40,000 RECRUIT GUIDE. NOT ASSOCIATED WITH GAMES WORKSHOP LTD.</p>
          <p className="mt-1 text-stone-700 tracking-wider">POWERED BY SECURE COGNITIVE CORES & GEMINI INTELLECT.</p>
        </footer>

        {/* 5. Mobile Bottom Dock Navigation (Sticky) */}
        <nav 
          className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-grim-card/95 border-t border-grim-border/90 backdrop-blur-lg z-40 flex justify-around items-center px-2 pb-safe select-none shadow-2xl" 
          id="mobile-bottom-nav"
        >
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 cursor-pointer ${
                  isActive ? "text-amber-500" : "text-stone-500 hover:text-stone-300"
                }`}
                id={`mobile-nav-${item.id}`}
              >
                <div className={`relative p-1 rounded-lg ${
                  isActive ? "bg-amber-500/10 text-amber-400" : ""
                }`}>
                  <IconComponent className="w-4 h-4 shrink-0" />
                  {item.badge === "AI" && (
                    <span className="absolute -top-1 -right-2 text-[7px] font-bold bg-amber-500 text-slate-950 px-1 rounded-sm scale-75 font-mono">
                      AI
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-black tracking-wider font-display uppercase">
                  {item.short}
                </span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* 6. High-end Immersive Onboarding Briefing Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-in backdrop-blur-md" id="onboarding-modal-container">
          <div 
            className="bg-grim-card border border-amber-600/35 rounded-xl max-w-lg w-full overflow-hidden shadow-amber-glow-strong flex flex-col relative animate-slide-up" 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top Header Graphic Banner */}
            <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-5 py-4 flex items-center justify-between border-b border-amber-800/20 shadow-lg">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-slate-950 animate-pulse" />
                <span className="font-display font-black tracking-widest text-slate-950 uppercase text-xs">
                  STRATEGIUM BRIEFING CORE
                </span>
              </div>
              <button 
                onClick={() => setShowOnboarding(false)}
                className="text-slate-950 hover:text-white hover:bg-slate-950/20 px-2 py-1 rounded transition font-mono font-bold text-[10px] cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>

            {/* Slide Body */}
            <div className="p-6 flex-1 flex flex-col gap-5 bg-gradient-to-b from-stone-900/40 to-transparent">
              {/* Slide Progress segments */}
              <div className="flex gap-1.5">
                {onboardingSlides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-1 rounded transition-all duration-300 ${
                      i === onboardingStep 
                        ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                        : "bg-stone-800"
                    }`}
                  />
                ))}
              </div>

              {/* Slide Content */}
              <div className="flex flex-col gap-3 min-h-[140px] transition-all duration-300">
                <h3 className="text-lg font-black text-amber-400 tracking-wide font-display uppercase border-b border-stone-800 pb-2">
                  {onboardingSlides[onboardingStep].title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-sans font-medium">
                  {onboardingSlides[onboardingStep].description}
                </p>
              </div>

              {/* Tactical tip callout box */}
              <div className="bg-stone-950/90 border border-stone-800 p-3.5 rounded-lg text-[11px] text-amber-500 font-mono flex gap-2 items-start shadow-inner">
                <div className="bg-amber-500/10 p-1 border border-amber-500/20 rounded">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="leading-relaxed">
                  <strong className="text-amber-400 block uppercase tracking-wider text-[10px] mb-0.5">TACTICAL BRIEFING ADVISORY:</strong> 
                  {onboardingSlides[onboardingStep].accent}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="bg-stone-950/80 border-t border-grim-border/80 px-6 py-4.5 flex items-center justify-between select-none">
              <button
                onClick={() => onboardingStep > 0 && setOnboardingStep(onboardingStep - 1)}
                disabled={onboardingStep === 0}
                className={`text-[10px] font-bold font-mono uppercase tracking-widest transition px-3.5 py-2 rounded-lg border border-stone-800 text-stone-400 ${
                  onboardingStep > 0 ? "hover:text-stone-100 hover:bg-stone-900 cursor-pointer" : "opacity-25 cursor-not-allowed"
                }`}
              >
                &larr; Back
              </button>

              <div className="text-[10px] text-stone-500 font-mono">
                SEGMENT {onboardingStep + 1} / {onboardingSlides.length}
              </div>

              {onboardingStep < onboardingSlides.length - 1 ? (
                <button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black font-mono px-4 py-2.5 rounded-lg cursor-pointer transition-all active:scale-95 hover:shadow-amber-glow"
                >
                  CONTINUE &rarr;
                </button>
              ) : (
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black font-mono px-5 py-2.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-lg shadow-amber-500/20 hover:shadow-amber-glow-strong"
                >
                  START COMPANION
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
