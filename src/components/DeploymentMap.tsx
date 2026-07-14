/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Map, Ruler, Trash2, Plus, RotateCcw, Shield, Swords, 
  HelpCircle, Compass, Layout, Layers, Info, Move, Eye, ChevronRight
} from "lucide-react";
import { FACTIONS } from "../data/factions";
import { ArmyRoster, Datacard } from "../types";

interface DeploymentMapProps {
  p1Roster?: ArmyRoster;
  p2Roster?: ArmyRoster;
  p1Name: string;
  p2Name: string;
  p1Faction: string;
  p2Faction: string;
}

interface MapToken {
  id: string;
  type: "p1" | "p2" | "terrain";
  name: string;
  x: number;
  y: number;
  size: number; // radius in px (10px = 1")
  color: string;
  rangeBubble: "none" | "move_6" | "charge_12" | "weapon_24";
  terrainType?: "ruins" | "woods" | "barricades" | "craters";
}

export default function DeploymentMap({
  p1Roster,
  p2Roster,
  p1Name,
  p2Name,
  p1Faction,
  p2Faction
}: DeploymentMapProps) {
  // Config
  const [deploymentStyle, setDeploymentStyle] = useState<"dawnOfWar" | "searchAndDestroy" | "hammerAndAnvil" | "sweepingEngagement">("dawnOfWar");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showObjectiveRanges, setShowObjectiveRanges] = useState<boolean>(true); // 3" control range indicator
  
  // Custom tokens (units and terrain placed by user)
  const [tokens, setTokens] = useState<MapToken[]>([
    // Seed a couple of default terrain pieces so the board doesn't look empty
    { id: "terrain-1", type: "terrain", name: "Ruin Piece A", x: 150, y: 220, size: 30, color: "stone", rangeBubble: "none", terrainType: "ruins" },
    { id: "terrain-2", type: "terrain", name: "Ruin Piece B", x: 450, y: 220, size: 30, color: "stone", rangeBubble: "none", terrainType: "ruins" },
    { id: "terrain-3", type: "terrain", name: "Woods Footprint", x: 300, y: 120, size: 40, color: "emerald", rangeBubble: "none", terrainType: "woods" }
  ]);

  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  
  // Placement State
  const [placingType, setPlacingType] = useState<"none" | "p1" | "p2" | "terrain">("none");
  const [placingName, setPlacingName] = useState<string>("");
  const [placingBaseSize, setPlacingBaseSize] = useState<number>(25); // in mm (e.g., 25, 32, 40, 50)
  const [placingTerrainType, setPlacingTerrainType] = useState<"ruins" | "woods" | "barricades" | "craters">("ruins");

  // Measurement State
  const [isMeasuringMode, setIsMeasuringMode] = useState<boolean>(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null);
  const [measureResult, setMeasureResult] = useState<number | null>(null);

  // SVG Ref for relative coordinates
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Styles Details
  const stylesInfo = {
    dawnOfWar: {
      name: "Dawn of War",
      description: "Traditional meeting engagement. Deployment lines run parallel to the long edges of the battlefield.",
      p1ZoneText: "P1 Zone (Long Edge) - 12\" Deep",
      p2ZoneText: "P2 Zone (Long Edge) - 12\" Deep",
      noMansLandText: "No Man's Land - 20\" Gap",
      objectives: [
        { id: 1, name: "Objective 1", x: 300, y: 220, type: "center" },
        { id: 2, name: "Objective 2", x: 150, y: 150, type: "left-top" },
        { id: 3, name: "Objective 3", x: 450, y: 150, type: "right-top" },
        { id: 4, name: "Objective 4", x: 150, y: 290, type: "left-bottom" },
        { id: 5, name: "Objective 5", x: 450, y: 290, type: "right-bottom" }
      ]
    },
    searchAndDestroy: {
      name: "Search and Destroy",
      description: "Quartered deployment format. Armies deploy in opposite diagonal quadrants, creating localized combat pressure.",
      p1ZoneText: "P1 Zone (Top Left Quadrant)",
      p2ZoneText: "P2 Zone (Bottom Right Quadrant)",
      noMansLandText: "Diagonal No Man's Land - 9\" Center Buffer",
      objectives: [
        { id: 1, name: "Objective 1", x: 300, y: 220, type: "center" },
        { id: 2, name: "Objective 2", x: 150, y: 110, type: "top-left" },
        { id: 3, name: "Objective 3", x: 450, y: 330, type: "bottom-right" },
        { id: 4, name: "Objective 4", x: 450, y: 110, type: "top-right" },
        { id: 5, name: "Objective 5", x: 150, y: 330, type: "bottom-left" }
      ]
    },
    hammerAndAnvil: {
      name: "Hammer and Anvil",
      description: "Short edge confrontation. Armies deploy on opposite narrow ends of the table, making ranged weaponry and slow advances pivotal.",
      p1ZoneText: "P1 Zone (Left Edge) - 12\" Deep",
      p2ZoneText: "P2 Zone (Right Edge) - 12\" Deep",
      noMansLandText: "No Man's Land - Massive 36\" Distance",
      objectives: [
        { id: 1, name: "Objective 1", x: 300, y: 220, type: "center" },
        { id: 2, name: "Objective 2", x: 300, y: 110, type: "top-mid" },
        { id: 3, name: "Objective 3", x: 300, y: 330, type: "bottom-mid" },
        { id: 4, name: "Objective 4", x: 150, y: 220, type: "left-mid" },
        { id: 5, name: "Objective 5", x: 450, y: 220, type: "right-mid" }
      ]
    },
    sweepingEngagement: {
      name: "Sweeping Engagement",
      description: "Angled deployment lines across opposing corner sectors, creating unbalanced flank fights.",
      p1ZoneText: "P1 Zone (Top Left Corner Angle)",
      p2ZoneText: "P2 Zone (Bottom Right Corner Angle)",
      noMansLandText: "Angled No Man's Land - 18\" Buffer",
      objectives: [
        { id: 1, name: "Objective 1", x: 300, y: 220, type: "center" },
        { id: 2, name: "Objective 2", x: 450, y: 140, type: "top-right-angled" },
        { id: 3, name: "Objective 3", x: 150, y: 300, type: "bottom-left-angled" },
        { id: 4, name: "Objective 4", x: 180, y: 110, type: "top-left-angled" },
        { id: 5, name: "Objective 5", x: 420, y: 330, type: "bottom-right-angled" }
      ]
    }
  };

  const activeStyleInfo = stylesInfo[deploymentStyle];

  // Helper to convert mm base sizes (e.g. 25, 32, 40) to standard pixels (10px = 1" = 25.4mm)
  const getRadiusForBase = (baseMm: number) => {
    // 1 inch = 25.4mm = 10px. So 1mm = 0.393 px.
    return Math.max(10, Math.round(baseMm * 0.393));
  };

  // Convert pixels to Warhammer inches
  const pxToInches = (px: number) => {
    return (px / 10).toFixed(1);
  };

  // Handle map click for placement & measurement
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    // Get mouse position relative to SVG
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 600);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 440);

    // If measuring mode is on
    if (isMeasuringMode) {
      if (!measureStart) {
        setMeasureStart({ x, y });
        setMeasureEnd(null);
        setMeasureResult(null);
      } else if (!measureEnd) {
        setMeasureEnd({ x, y });
        const dx = x - measureStart.x;
        const dy = y - measureStart.y;
        const distPx = Math.sqrt(dx * dx + dy * dy);
        setMeasureResult(distPx / 10); // 10px = 1"
      } else {
        // Reset measurement
        setMeasureStart({ x, y });
        setMeasureEnd(null);
        setMeasureResult(null);
      }
      return;
    }

    // If placing a new token
    if (placingType !== "none") {
      const radius = placingType === "terrain" ? (placingTerrainType === "woods" ? 40 : 30) : getRadiusForBase(placingBaseSize);
      const colors = {
        p1: "sky",
        p2: "red",
        terrain: placingTerrainType === "woods" ? "emerald" : "stone"
      };

      const newToken: MapToken = {
        id: `token-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: placingType as any,
        name: placingName || (placingType === "terrain" ? `Terrain: ${placingTerrainType}` : "Custom Unit"),
        x,
        y,
        size: radius,
        color: colors[placingType],
        rangeBubble: "none",
        terrainType: placingType === "terrain" ? placingTerrainType : undefined
      };

      setTokens([...tokens, newToken]);
      setSelectedTokenId(newToken.id);
      
      // Stop placing unless shift click
      if (!e.shiftKey) {
        setPlacingType("none");
        setPlacingName("");
      }
      return;
    }

    // Clicking empty space cancels token selection
    setSelectedTokenId(null);
  };

  // Dragging event handlers
  const handleTokenMouseDown = (e: React.MouseEvent, tokenId: string) => {
    e.stopPropagation();
    if (isMeasuringMode) return;
    
    setSelectedTokenId(tokenId);
    const token = tokens.find(t => t.id === tokenId);
    if (!token || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 600;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 440;

    setDraggedTokenId(tokenId);
    setDragOffset({
      x: mouseX - token.x,
      y: mouseY - token.y
    });
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (!draggedTokenId || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    let mouseX = ((e.clientX - rect.left) / rect.width) * 600;
    let mouseY = ((e.clientY - rect.top) / rect.height) * 440;

    // Bounds checking
    mouseX = Math.max(0, Math.min(600, mouseX));
    mouseY = Math.max(0, Math.min(440, mouseY));

    setTokens(prev => prev.map(token => {
      if (token.id === draggedTokenId) {
        return {
          ...token,
          x: Math.round(mouseX - dragOffset.x),
          y: Math.round(mouseY - dragOffset.y)
        };
      }
      return token;
    }));
  };

  const handleSvgMouseUp = () => {
    setDraggedTokenId(null);
  };

  const deleteToken = (id: string) => {
    setTokens(tokens.filter(t => t.id !== id));
    if (selectedTokenId === id) setSelectedTokenId(null);
  };

  const resetBoard = () => {
    setTokens([
      { id: "terrain-1", type: "terrain", name: "Ruin Piece A", x: 150, y: 220, size: 30, color: "stone", rangeBubble: "none", terrainType: "ruins" },
      { id: "terrain-2", type: "terrain", name: "Ruin Piece B", x: 450, y: 220, size: 30, color: "stone", rangeBubble: "none", terrainType: "ruins" },
      { id: "terrain-3", type: "terrain", name: "Woods Footprint", x: 300, y: 120, size: 40, color: "emerald", rangeBubble: "none", terrainType: "woods" }
    ]);
    setSelectedTokenId(null);
    setMeasureStart(null);
    setMeasureEnd(null);
    setMeasureResult(null);
    setIsMeasuringMode(false);
  };

  const selectedToken = tokens.find(t => t.id === selectedTokenId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4 animate-fade-in" id="interactive-deployment-map-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-amber-500" />
          <div>
            <h4 className="font-bold text-slate-200">Deployment Planner & Board Simulator</h4>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-0.5">Warhammer 40k 10th Edition Deployment Formats</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setIsMeasuringMode(!isMeasuringMode)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              isMeasuringMode 
                ? "bg-sky-500/10 border-sky-500 text-sky-400" 
                : "bg-slate-950 border-slate-850 text-stone-400 hover:text-stone-300"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{isMeasuringMode ? "Ruler Active" : "Measure Tool"}</span>
          </button>
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              showGrid 
                ? "bg-slate-950 border-slate-800 text-amber-400" 
                : "bg-slate-950/20 border-slate-850/40 text-stone-600"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Grid {showGrid ? "ON" : "OFF"}</span>
          </button>
          <button 
            onClick={resetBoard}
            className="px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-950 border border-red-950 text-red-400 hover:bg-red-950/10 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Map</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Deployment Style Details & Custom Unit Placer */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Style Selector Tabs */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">1. Select Deployment Style</span>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
              {(Object.keys(stylesInfo) as Array<keyof typeof stylesInfo>).map(st => {
                const isActive = deploymentStyle === st;
                return (
                  <button
                    key={st}
                    onClick={() => {
                      setDeploymentStyle(st);
                      // Reset measurements
                      setMeasureStart(null);
                      setMeasureEnd(null);
                      setMeasureResult(null);
                    }}
                    className={`px-2 py-2 rounded-lg text-[10px] font-bold text-center uppercase font-mono tracking-wide transition cursor-pointer border ${
                      isActive 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                        : "bg-transparent border-transparent text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    {stylesInfo[st].name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deployment Style Info card */}
          <div className="bg-slate-950/80 border border-slate-850 p-3.5 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
              <span className="text-xs font-bold text-slate-200">{activeStyleInfo.name} Format</span>
              <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-stone-500 px-1.5 py-0.5 rounded">60" x 44" Table</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">{activeStyleInfo.description}</p>
            <div className="flex flex-col gap-1.5 mt-1 border-t border-slate-900 pt-2 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>{activeStyleInfo.p1ZoneText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>{activeStyleInfo.p2ZoneText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 border-b border-dashed border-amber-500/50" />
                <span>{activeStyleInfo.noMansLandText}</span>
              </div>
            </div>
          </div>

          {/* Place custom units panel */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 flex flex-col gap-3">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono flex justify-between items-center">
              <span>2. Tactical Unit Spawner</span>
              {placingType !== "none" && (
                <span className="text-[8px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded animate-pulse">
                  Placing Active
                </span>
              )}
            </span>

            {/* Quick pre-sets based on Loaded Rosters */}
            <div className="flex flex-col gap-2.5">
              
              {/* Player 1 Spawner */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-sky-400 font-bold font-mono uppercase">{p1Name.split(" ")[0]}'s Squads ({p1Faction})</span>
                {p1Roster && p1Roster.items.length > 0 ? (
                  <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto pr-1">
                    {p1Roster.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setPlacingType("p1");
                          setPlacingName(item.name);
                          setPlacingBaseSize(32); // Default estimate for standard infantry
                        }}
                        className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-850 text-[11px] px-2.5 py-1.5 rounded text-stone-300 hover:text-white transition flex justify-between items-center cursor-pointer"
                      >
                        <span className="truncate">{item.name}</span>
                        <span className="text-[9px] text-gray-500 shrink-0 font-mono">x{item.count}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setPlacingType("p1");
                        setPlacingName(`${p1Faction} Commander`);
                        setPlacingBaseSize(40);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 py-1 px-2 rounded text-[10px] cursor-pointer"
                    >
                      + Leader (40mm)
                    </button>
                    <button
                      onClick={() => {
                        setPlacingType("p1");
                        setPlacingName(`${p1Faction} Squad`);
                        setPlacingBaseSize(32);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 py-1 px-2 rounded text-[10px] cursor-pointer"
                    >
                      + Infantry (32mm)
                    </button>
                  </div>
                )}
              </div>

              {/* Player 2 Spawner */}
              <div className="flex flex-col gap-1.5 border-t border-slate-900 pt-2.5">
                <span className="text-[10px] text-red-400 font-bold font-mono uppercase">{p2Name.split(" ")[0]}'s Squads ({p2Faction})</span>
                {p2Roster && p2Roster.items.length > 0 ? (
                  <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto pr-1">
                    {p2Roster.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setPlacingType("p2");
                          setPlacingName(item.name);
                          setPlacingBaseSize(32);
                        }}
                        className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-850 text-[11px] px-2.5 py-1.5 rounded text-stone-300 hover:text-white transition flex justify-between items-center cursor-pointer"
                      >
                        <span className="truncate">{item.name}</span>
                        <span className="text-[9px] text-gray-500 shrink-0 font-mono">x{item.count}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setPlacingType("p2");
                        setPlacingName(`${p2Faction} Commander`);
                        setPlacingBaseSize(40);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 py-1 px-2 rounded text-[10px] cursor-pointer"
                    >
                      + Leader (40mm)
                    </button>
                    <button
                      onClick={() => {
                        setPlacingType("p2");
                        setPlacingName(`${p2Faction} Swarm`);
                        setPlacingBaseSize(28);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 py-1 px-2 rounded text-[10px] cursor-pointer"
                    >
                      + Squad (28mm)
                    </button>
                  </div>
                )}
              </div>

              {/* Place Terrain */}
              <div className="flex flex-col gap-1.5 border-t border-slate-900 pt-2.5">
                <span className="text-[10px] text-emerald-500 font-bold font-mono uppercase">Add Cover Scenery (Terrain)</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setPlacingType("terrain");
                      setPlacingTerrainType("ruins");
                      setPlacingName("🏢 Ruined Wall");
                    }}
                    className="bg-slate-900 hover:bg-slate-850 text-[10px] py-1 px-2 border border-slate-800 rounded text-stone-300 flex justify-between items-center cursor-pointer"
                  >
                    <span>🏢 Ruins</span>
                    <span className="text-[8px] bg-sky-500/10 text-sky-400 px-1 rounded">Cover</span>
                  </button>
                  <button
                    onClick={() => {
                      setPlacingType("terrain");
                      setPlacingTerrainType("woods");
                      setPlacingName("🌲 Woods area");
                    }}
                    className="bg-slate-900 hover:bg-slate-850 text-[10px] py-1 px-2 border border-slate-800 rounded text-stone-300 flex justify-between items-center cursor-pointer"
                  >
                    <span>🌲 Woods</span>
                    <span className="text-[8px] bg-sky-500/10 text-sky-400 px-1 rounded">Conceal</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Placement Help */}
            {placingType !== "none" && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] p-2.5 rounded-lg leading-normal flex flex-col gap-1 animate-fade-in">
                <span><strong>Placing:</strong> {placingName || placingType}</span>
                <span>💡 Click on the canvas grid to deploy this model. Hold <kbd className="bg-slate-950 px-1 py-0.5 rounded border border-amber-500/25">Shift</kbd> to place multiple units!</span>
                <button 
                  onClick={() => setPlacingType("none")}
                  className="text-[9px] font-mono uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1 px-2 rounded-md self-end mt-1 cursor-pointer"
                >
                  Cancel Placement
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Large Interactive Canvas Board */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          {/* Active Selection Details Strip */}
          <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs flex justify-between items-center min-h-[42px] font-mono">
            {selectedToken ? (
              <div className="flex items-center gap-3 w-full justify-between flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    selectedToken.type === "p1" ? "bg-sky-500" : selectedToken.type === "p2" ? "bg-red-500" : "bg-stone-500"
                  }`} />
                  <span className="font-bold text-slate-200">{selectedToken.name}</span>
                  <span className="text-stone-500 text-[10px]">Position: ({pxToInches(selectedToken.x)}", {pxToInches(selectedToken.y)}")</span>
                </div>
                
                {/* Bubble Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-gray-500 uppercase font-bold mr-1">Ruler Ring:</span>
                  {[
                    { id: "none", label: "None" },
                    { id: "move_6", label: "6\" Move" },
                    { id: "charge_12", label: "12\" Charge" },
                    { id: "weapon_24", label: "24\" Shoot" }
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setTokens(prev => prev.map(t => t.id === selectedToken.id ? { ...t, rangeBubble: b.id as any } : t))}
                      className={`text-[9px] px-2 py-0.5 rounded cursor-pointer ${
                        selectedToken.rangeBubble === b.id 
                          ? "bg-amber-500 text-slate-950 font-bold" 
                          : "bg-slate-900 text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => deleteToken(selectedToken.id)}
                    className="p-1 rounded bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-900/40 ml-1 cursor-pointer"
                    title="Remove from board"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : isMeasuringMode ? (
              <div className="text-stone-400 flex justify-between items-center w-full">
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-sky-400" />
                  <span>{measureStart ? `A: (${pxToInches(measureStart.x)}", ${pxToInches(measureStart.y)}")` : "Click on board to set Point A"}</span>
                  {measureEnd && <span className="text-amber-400 ml-1 font-bold">➡️ B: ({pxToInches(measureEnd.x)}", {pxToInches(measureEnd.y)}")</span>}
                </span>
                {measureResult !== null && (
                  <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    Distance: {measureResult.toFixed(1)}" inches
                  </span>
                )}
              </div>
            ) : (
              <span className="text-stone-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-600" />
                <span>Drag custom tokens to plan deployment. Click a token to toggle custom threat/weapon range circles!</span>
              </span>
            )}
          </div>

          {/* SVG Map Canvas */}
          <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-inner select-none">
            <svg
              ref={svgRef}
              viewBox="0 0 600 440"
              className="w-full h-auto cursor-crosshair relative"
              onClick={handleMapClick}
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUp}
              onMouseLeave={handleSvgMouseUp}
            >
              {/* Definitions for grids and patterns */}
              <defs>
                <pattern id="grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.04" />
                </pattern>
                <pattern id="diagonal-stripe-1" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.1" />
                </pattern>
                <pattern id="diagonal-stripe-2" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.1" />
                </pattern>
              </defs>

              {/* 1. Base Table Canvas */}
              <rect width="600" height="440" fill="#0b0f19" />

              {/* 2. Grid lines (5-inch steps) */}
              {showGrid && (
                <rect width="600" height="440" fill="url(#grid-pattern)" />
              )}

              {/* 3. Render Shaded Deployment Zones depending on Style */}
              {deploymentStyle === "dawnOfWar" && (
                <>
                  {/* Player 1: Top 12" */}
                  <rect x="0" y="0" width="600" height="120" fill="url(#diagonal-stripe-1)" />
                  <rect x="0" y="0" width="600" height="120" fill="#0ea5e9" fillOpacity="0.03" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                  
                  {/* Player 2: Bottom 12" */}
                  <rect x="0" y="320" width="600" height="120" fill="url(#diagonal-stripe-2)" />
                  <rect x="0" y="320" width="600" height="120" fill="#ef4444" fillOpacity="0.03" />
                  <line x1="0" y1="320" x2="600" y2="320" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                </>
              )}

              {deploymentStyle === "hammerAndAnvil" && (
                <>
                  {/* Player 1: Left 12" */}
                  <rect x="0" y="0" width="120" height="440" fill="url(#diagonal-stripe-1)" />
                  <rect x="0" y="0" width="120" height="440" fill="#0ea5e9" fillOpacity="0.03" />
                  <line x1="120" y1="0" x2="120" y2="440" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                  
                  {/* Player 2: Right 12" */}
                  <rect x="480" y="0" width="120" height="440" fill="url(#diagonal-stripe-2)" />
                  <rect x="480" y="0" width="120" height="440" fill="#ef4444" fillOpacity="0.03" />
                  <line x1="480" y1="0" x2="480" y2="440" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                </>
              )}

              {deploymentStyle === "searchAndDestroy" && (
                <>
                  {/* Diagonal divides with 9" (90px) exclusion around center (300, 220) */}
                  {/* P1: Top-Left quadrant */}
                  <polygon points="0,0 300,0 300,130 180,220 0,220" fill="url(#diagonal-stripe-1)" />
                  <polygon points="0,0 300,0 300,130 180,220 0,220" fill="#0ea5e9" fillOpacity="0.03" />
                  <path d="M 300,130 L 180,220" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                  <line x1="300" y1="0" x2="300" y2="130" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                  <line x1="0" y1="220" x2="180" y2="220" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />

                  {/* P2: Bottom-Right quadrant */}
                  <polygon points="600,440 300,440 300,310 420,220 600,220" fill="url(#diagonal-stripe-2)" />
                  <polygon points="600,440 300,440 300,310 420,220 600,220" fill="#ef4444" fillOpacity="0.03" />
                  <path d="M 300,310 L 420,220" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                  <line x1="300" y1="440" x2="300" y2="310" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                  <line x1="600" y1="220" x2="420" y2="220" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />

                  {/* Exclusion Bubble circle */}
                  <circle cx="300" cy="220" r="90" fill="none" stroke="#amber-500" strokeWidth="0.5" strokeDasharray="2,5" strokeOpacity="0.25" />
                </>
              )}

              {deploymentStyle === "sweepingEngagement" && (
                <>
                  {/* Angled lines across corners */}
                  {/* P1: Top Left */}
                  <polygon points="0,0 380,0 0,280" fill="url(#diagonal-stripe-1)" />
                  <polygon points="0,0 380,0 0,280" fill="#0ea5e9" fillOpacity="0.03" />
                  <line x1="380" y1="0" x2="0" y2="280" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />

                  {/* P2: Bottom Right */}
                  <polygon points="600,440 220,440 600,160" fill="url(#diagonal-stripe-2)" />
                  <polygon points="600,440 220,440 600,160" fill="#ef4444" fillOpacity="0.03" />
                  <line x1="220" y1="440" x2="600" y2="160" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
                </>
              )}

              {/* 4. Center Guidelines & Axis reticles */}
              <line x1="300" y1="0" x2="300" y2="440" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.08" />
              <line x1="0" y1="220" x2="600" y2="220" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.08" />
              <circle cx="300" cy="220" r="4" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />

              {/* 5. Objective Markers (Interactive) */}
              {activeStyleInfo.objectives.map(obj => (
                <g key={obj.id} className="cursor-pointer group">
                  {/* 3-inch control range indicator (radius = 30px from edge of a 40mm marker, so total radius is approx 3" or 30px + 8px marker radius) */}
                  {showObjectiveRanges && (
                    <circle 
                      cx={obj.x} 
                      cy={obj.y} 
                      r="38" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="1" 
                      strokeDasharray="2,3" 
                      strokeOpacity="0.3" 
                      className="group-hover:strokeOpacity-70 transition duration-150"
                    />
                  )}
                  {/* Objective Base */}
                  <circle cx={obj.x} cy={obj.y} r="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.8" />
                  <circle cx={obj.x} cy={obj.y} r="3" fill="#f59e0b" />
                  {/* Objective text badge */}
                  <text 
                    x={obj.x} 
                    y={obj.y - 12} 
                    textAnchor="middle" 
                    fill="#f59e0b" 
                    fontSize="8" 
                    fontWeight="bold" 
                    fontFamily="monospace"
                  >
                    OBJ {obj.id}
                  </text>
                </g>
              ))}

              {/* 6. Threat/Range Bubbles for placed tokens (Rendered under tokens for visibility) */}
              {tokens.map(t => {
                if (t.rangeBubble === "none") return null;
                let radius = 0;
                let color = "rgba(245, 158, 11, 0.12)";
                let stroke = "#f59e0b";
                let label = "";

                if (t.rangeBubble === "move_6") {
                  radius = 60; // 6 inches
                  color = "rgba(14, 165, 233, 0.08)";
                  stroke = "#0ea5e9";
                  label = "6\" Move";
                } else if (t.rangeBubble === "charge_12") {
                  radius = 120; // 12 inches
                  color = "rgba(239, 68, 68, 0.05)";
                  stroke = "#ef4444";
                  label = "12\" Charge";
                } else if (t.rangeBubble === "weapon_24") {
                  radius = 240; // 24 inches
                  color = "rgba(168, 85, 247, 0.04)";
                  stroke = "#a855f7";
                  label = "24\" Weapon";
                }

                return (
                  <g key={`bubble-${t.id}`}>
                    <circle
                      cx={t.x}
                      cy={t.y}
                      r={radius}
                      fill={color}
                      stroke={stroke}
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      strokeOpacity="0.5"
                    />
                    <text
                      x={t.x}
                      y={t.y + radius + 10}
                      textAnchor="middle"
                      fill={stroke}
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* 7. Render Custom Placed Tokens (Units & Terrain) */}
              {tokens.map(t => {
                const isSelected = t.id === selectedTokenId;
                
                // Terrain rendering overrides
                if (t.type === "terrain") {
                  const isRuins = t.terrainType === "ruins";
                  return (
                    <g
                      key={t.id}
                      transform={`translate(${t.x}, ${t.y})`}
                      onMouseDown={(e) => handleTokenMouseDown(e, t.id)}
                      className="cursor-move group"
                    >
                      {/* Interaction glow */}
                      <circle cx="0" cy="0" r={t.size + 4} fill="none" stroke={isSelected ? "#10b981" : "transparent"} strokeWidth="2" />
                      
                      {/* Terrain Shape */}
                      {isRuins ? (
                        <>
                          {/* Rubble outline footprint */}
                          <rect x={-t.size} y={-t.size} width={t.size*2} height={t.size*2} rx="4" fill="#334155" fillOpacity="0.45" stroke="#64748b" strokeWidth="1.5" />
                          <line x1={-t.size + 10} y1={-t.size + 10} x2={t.size - 10} y2={-t.size + 10} stroke="#475569" strokeWidth="3" />
                          <line x1={-t.size + 10} y1={-t.size + 10} x2={-t.size + 10} y2={t.size - 10} stroke="#475569" strokeWidth="3" />
                          <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="14">🏢</text>
                        </>
                      ) : (
                        <>
                          <circle cx="0" cy="0" r={t.size} fill="#064e3b" fillOpacity="0.35" stroke="#059669" strokeWidth="1.5" strokeDasharray="3,2" />
                          <circle cx="-10" cy="-10" r="12" fill="#047857" fillOpacity="0.4" />
                          <circle cx="12" cy="8" r="14" fill="#047857" fillOpacity="0.4" />
                          <text x="0" y="4" textAnchor="middle" fill="#34d399" fontSize="14">🌲</text>
                        </>
                      )}

                      {/* Small text label */}
                      <text
                        x="0"
                        y={t.size + 10}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="7"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="opacity-0 group-hover:opacity-100 transition duration-150"
                      >
                        {t.name}
                      </text>
                    </g>
                  );
                }

                const isP1 = t.type === "p1";
                const baseColor = isP1 ? "#0ea5e9" : "#ef4444";
                const badgeText = isP1 ? "P1" : "P2";

                return (
                  <g
                    key={t.id}
                    transform={`translate(${t.x}, ${t.y})`}
                    onMouseDown={(e) => handleTokenMouseDown(e, t.id)}
                    className="cursor-move group"
                  >
                    {/* Ring highlight for selected token */}
                    <circle
                      cx="0"
                      cy="0"
                      r={t.size + 5}
                      fill="none"
                      stroke={isSelected ? "#f59e0b" : "transparent"}
                      strokeWidth="2.5"
                    />

                    {/* Outer glow ring indicating threat or faction loyalty */}
                    <circle
                      cx="0"
                      cy="0"
                      r={t.size}
                      fill={baseColor}
                      fillOpacity="0.12"
                      stroke={baseColor}
                      strokeWidth="2.5"
                      className="group-hover:stroke-opacity-100 stroke-opacity-70 transition duration-150"
                    />

                    {/* Miniature central circle base */}
                    <circle cx="0" cy="0" r={Math.max(6, t.size - 6)} fill="#1e293b" stroke="#334155" strokeWidth="1" />

                    {/* Central Icon representation */}
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={baseColor}
                      fontSize={t.size > 20 ? "9" : "7"}
                      fontWeight="black"
                      fontFamily="monospace"
                    >
                      {badgeText}
                    </text>

                    {/* Small text label above token */}
                    <text
                      x="0"
                      y={-t.size - 6}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="bg-slate-950 p-1 rounded"
                    >
                      {t.name.substring(0, 15)}
                    </text>
                  </g>
                );
              })}

              {/* 8. Render Measuring Line (Active) */}
              {isMeasuringMode && measureStart && (
                <g>
                  <circle cx={measureStart.x} cy={measureStart.y} r="5" fill="#38bdf8" />
                  
                  {measureEnd ? (
                    <>
                      <circle cx={measureEnd.x} cy={measureEnd.y} r="5" fill="#f59e0b" />
                      <line
                        x1={measureStart.x}
                        y1={measureStart.y}
                        x2={measureEnd.x}
                        y2={measureEnd.y}
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                      {/* Distance Badge on Line */}
                      <g transform={`translate(${(measureStart.x + measureEnd.x)/2}, ${(measureStart.y + measureEnd.y)/2})`}>
                        <rect
                          x="-22"
                          y="-9"
                          width="44"
                          height="18"
                          rx="4"
                          fill="#090d16"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {measureResult !== null ? `${measureResult.toFixed(1)}"` : ""}
                        </text>
                      </g>
                    </>
                  ) : (
                    /* Dotted trace line to mouse or pointer */
                    <circle cx={measureStart.x} cy={measureStart.y} r="10" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" className="animate-ping" />
                  )}
                </g>
              )}

              {/* Grid Ruler Markers on Borders */}
              {/* Top border notches */}
              {Array.from({ length: 7 }).map((_, i) => (
                <g key={`notch-t-${i}`} transform={`translate(${i * 100}, 0)`}>
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.25" />
                  <text x="3" y="14" fill="#ffffff" fillOpacity="0.3" fontSize="7" fontFamily="monospace">{i * 10}"</text>
                </g>
              ))}
              {/* Left border notches */}
              {Array.from({ length: 5 }).map((_, i) => (
                <g key={`notch-l-${i}`} transform={`translate(0, ${i * 100})`}>
                  <line x1="0" y1="0" x2="8" y2="0" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.25" />
                  {i > 0 && <text x="12" y="3" fill="#ffffff" fillOpacity="0.3" fontSize="7" fontFamily="monospace">{i * 10}"</text>}
                </g>
              ))}

            </svg>
          </div>

          {/* Quick Stats Summary Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase font-mono">P1 Deployment</span>
              <span className="text-sm font-black text-sky-400 font-mono mt-0.5">
                {tokens.filter(t => t.type === "p1").length} Units Placed
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase font-mono">P2 Deployment</span>
              <span className="text-sm font-black text-red-400 font-mono mt-0.5">
                {tokens.filter(t => t.type === "p2").length} Units Placed
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase font-mono">Scenery Cover</span>
              <span className="text-sm font-black text-emerald-500 font-mono mt-0.5">
                {tokens.filter(t => t.type === "terrain" && t.terrainType === "ruins").length} Ruins / {tokens.filter(t => t.type === "terrain" && t.terrainType === "woods").length} Woods
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase font-mono">Distance Unit Scale</span>
              <span className="text-xs text-amber-500 font-bold font-mono mt-0.5 flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-500" />
                <span>10px = 1" (Inch)</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
