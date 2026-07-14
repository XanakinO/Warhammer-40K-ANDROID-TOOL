/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { FACTIONS } from "../data/factions";
import { ArmyRoster, Datacard, RosterItem, Faction } from "../types";
import { 
  Plus, Minus, Trash2, CheckCircle2, AlertTriangle, 
  Copy, Save, FileText, Sparkles, FolderOpen, RefreshCw,
  ChevronDown, ChevronUp, Eye, ChevronsDown, ChevronsUp, HelpCircle
} from "lucide-react";

const FACTION_ENHANCEMENTS: Record<string, { name: string; points: number }[]> = {
  space_marines: [
    { name: "Artisan Artificer", points: 15 },
    { name: "Honor Vehement", points: 15 },
    { name: "The Imperium's Sword", points: 20 }
  ],
  tyranids: [
    { name: "Adaptive Biology", points: 25 },
    { name: "Alien Cunning", points: 30 },
    { name: "Synaptic Linchpin", points: 10 }
  ],
  necrons: [
    { name: "Phonal Subjugator", points: 20 },
    { name: "Sempiternal Weave", points: 10 },
    { name: "Veil of Darkness", points: 20 }
  ],
  aeldari: [
    { name: "Fate's Messenger", points: 15 },
    { name: "The Weeping Stones", points: 15 },
    { name: "Reader of the Runes", points: 20 }
  ]
};

const DIAGNOSTIC_RULES_EXPLAIN: Record<string, { title: string; text: string; fix: string }> = {
  points: {
    title: "Points Cap & Army Limits",
    text: "Every model and squad in Warhammer 40k has a points cost reflecting its combat prowess. When building a list, players agree on a limit (such as 500, 1000, or 2000 points) and build their roster to fit exactly within or under that limit. Going over points is illegal in matched play.",
    fix: "Use the '-' buttons on your active roster to reduce unit counts, or click the Trash icon to remove units until your total is equal to or under your points cap."
  },
  warlord_none: {
    title: "The Warlord Obligation",
    text: "In 10th Edition, every army must have exactly one leader designated as the Warlord. This represents the force commander. If your Warlord is killed, it may reward points to your opponent, but starting with a Warlord is mandatory!",
    fix: "Ensure you have at least one Character unit in your list. Then, click the 'Set as Warlord' button next to that character in your Active Roster."
  },
  warlord_invalid: {
    title: "Invalid Warlord Selection",
    text: "Only units with the 'Character' keyword can be chosen as your supreme Warlord. Regular battleline squads, heavy tanks, or swarm creatures cannot command an entire strike force.",
    fix: "Add a Character unit, then tap 'Set as Warlord' next to it to override the invalid choice."
  },
  rule_of_3: {
    title: "The Rule of 3 & Rule of 6",
    text: "To ensure variety and prevent players from spamming too many powerful models, standard games enforce the 'Rule of 3': You can include at most 3 copies of any individual datasheet (by name). If a unit has the 'Battleline' keyword, you can include up to 6 copies.",
    fix: "Reduce the count of duplicate units in your active roster until you have 3 or fewer (or 6 or fewer for Battleline units)."
  }
};

export default function ArmyBuilder() {
  const [savedRosters, setSavedRosters] = useState<ArmyRoster[]>([]);
  const [selectedFactionId, setSelectedFactionId] = useState<string>(FACTIONS[0].id);
  const [rosterName, setRosterName] = useState<string>("My First Strike Force");
  const [pointsLimit, setPointsLimit] = useState<number>(1000);
  const [rosterItems, setRosterItems] = useState<RosterItem[]>([]);
  const [rosterId, setRosterId] = useState<string | null>(null);
  const [detachmentName, setDetachmentName] = useState<string>(FACTIONS[0].detachment.name);
  const [selectedStratagemNames, setSelectedStratagemNames] = useState<string[]>([]);
  const [selectedEnhancementNames, setSelectedEnhancementNames] = useState<string[]>([]);
  const [exportText, setExportText] = useState<string>("");
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeDiagnosticRule, setActiveDiagnosticRule] = useState<string | null>(null);
  const [expandedCodexUnitIds, setExpandedCodexUnitIds] = useState<Record<string, boolean>>({});
  const [expandedActiveUnitIds, setExpandedActiveUnitIds] = useState<Record<string, boolean>>({});

  const activeFaction = FACTIONS.find(f => f.id === selectedFactionId) || FACTIONS[0];

  const renderFullDatacard = (datacard: Datacard) => {
    return (
      <div className="border-t border-grim-border/60 pt-4 pb-2 mt-2 flex flex-col gap-4 text-xs text-stone-300 animate-fade-in">
        {/* Core Stats Sheet Grid */}
        <div className="grid grid-cols-7 border border-grim-border rounded-lg overflow-hidden text-center bg-black/40">
          {[
            { label: "M", val: datacard.stats.m, tip: "Movement" },
            { label: "T", val: datacard.stats.t, tip: "Toughness" },
            { label: "SV", val: datacard.stats.sv, tip: "Save" },
            { label: "W", val: datacard.stats.w, tip: "Wounds" },
            { label: "LD", val: datacard.stats.ld, tip: "Leadership" },
            { label: "OC", val: datacard.stats.oc, tip: "Objective Control" },
            { label: "INV", val: datacard.stats.invul || "-", tip: "Invulnerable Save" }
          ].map((st, sidx) => (
            <div key={st.label} className={`flex flex-col p-2 ${sidx < 6 ? "border-r border-grim-border" : ""}`}>
              <span className="text-[9px] text-stone-500 font-mono font-bold" title={st.tip}>{st.label}</span>
              <span className="text-xs font-black text-amber-400 font-mono mt-0.5">{st.val}</span>
            </div>
          ))}
        </div>

        {/* Ranged Weapons Section */}
        {datacard.weapons.ranged.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-sky-400 font-mono uppercase tracking-wider text-left">Ranged Weapons</span>
            <div className="flex flex-col gap-1.5">
              {datacard.weapons.ranged.map((w, widx) => (
                <div key={widx} className="bg-black/30 border border-grim-border p-2 rounded-lg flex flex-col gap-1.5 text-left">
                  <span className="font-bold text-stone-200 text-[11px]">{w.name}</span>

                  <div className="grid grid-cols-6 text-center text-[9px] font-mono text-stone-400">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">RANGE</span>
                      <span className="font-bold text-stone-300 mt-0.5">{w.range}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">A</span>
                      <span className="font-bold text-stone-300 mt-0.5">{w.attacks}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">BS</span>
                      <span className="font-bold text-sky-400 mt-0.5">{w.skill}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">S</span>
                      <span className="font-bold text-stone-300 mt-0.5">{w.strength}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">AP</span>
                      <span className="font-bold text-stone-300 mt-0.5">-{Math.abs(w.ap)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">D</span>
                      <span className="font-bold text-amber-400 mt-0.5">{w.damage}</span>
                    </div>
                  </div>

                  {w.abilities && w.abilities.length > 0 && (
                    <div className="text-[8px] font-mono text-amber-500/80 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 mt-1">
                      <span className="font-bold">Keywords:</span> {w.abilities.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Melee Weapons Section */}
        {datacard.weapons.melee.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-red-400 font-mono uppercase tracking-wider text-left">Melee Weapons</span>
            <div className="flex flex-col gap-1.5">
              {datacard.weapons.melee.map((w, widx) => (
                <div key={widx} className="bg-black/30 border border-grim-border p-2 rounded-lg flex flex-col gap-1.5 text-left">
                  <span className="font-bold text-stone-200 text-[11px]">{w.name}</span>

                  <div className="grid grid-cols-6 text-center text-[9px] font-mono text-stone-400">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">RANGE</span>
                      <span className="font-bold text-stone-300 mt-0.5">Melee</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">A</span>
                      <span className="font-bold text-stone-300 mt-0.5">{w.attacks}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">WS</span>
                      <span className="font-bold text-sky-400 mt-0.5">{w.skill}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">S</span>
                      <span className="font-bold text-stone-300 mt-0.5">{w.strength}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">AP</span>
                      <span className="font-bold text-stone-300 mt-0.5">-{Math.abs(w.ap)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-500">D</span>
                      <span className="font-bold text-amber-400 mt-0.5">{w.damage}</span>
                    </div>
                  </div>

                  {w.abilities && w.abilities.length > 0 && (
                    <div className="text-[8px] font-mono text-amber-500/80 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 mt-1">
                      <span className="font-bold">Keywords:</span> {w.abilities.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Datasheet Abilities Section */}
        {datacard.abilities.datasheet && datacard.abilities.datasheet.length > 0 && (
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-wider">Abilities</span>
            <div className="flex flex-col gap-1.5 bg-black/20 p-2.5 rounded-lg border border-grim-border">
              {datacard.abilities.datasheet.map((ab, abidx) => (
                <div key={abidx} className="flex flex-col gap-0.5 border-b border-grim-border/50 pb-1.5 last:border-b-0 last:pb-0 font-sans">
                  <span className="font-bold text-stone-200 text-[10px] font-mono">{ab.name}</span>
                  <p className="text-stone-400 leading-relaxed text-[10px]">{ab.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unit Keywords */}
        {datacard.keywords && datacard.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 border-t border-grim-border/40 pt-2">
            {datacard.keywords.map((kw, kwidx) => (
              <span 
                key={kwidx} 
                className="text-[8px] font-mono bg-grim-dark border border-grim-border px-1.5 py-0.5 rounded text-stone-400"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Update faction-specific selections when faction changes
  useEffect(() => {
    setDetachmentName(activeFaction.detachment.name);
    setSelectedStratagemNames([]);
    setSelectedEnhancementNames([]);
  }, [selectedFactionId]);
  
  // Load saved lists from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("warhammer_40k_rosters");
    if (saved) {
      try {
        setSavedRosters(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved rosters", e);
      }
    }
  }, []);

  // Display brief toast notice
  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Add a unit datacard to the current roster
  const addUnitToRoster = (card: Datacard) => {
    const existing = rosterItems.find(item => item.datacardId === card.id);
    const limit = card.type === "Battleline" ? 6 : 3;

    if (existing) {
      if (existing.count >= limit) {
        showNotice(`Cannot add more than ${limit} copies of "${card.name}" (${card.type === "Battleline" ? "Battleline limit is 6" : "Standard limit is 3"}).`);
        return;
      }
      setRosterItems(
        rosterItems.map(item => 
          item.datacardId === card.id 
            ? { ...item, count: item.count + 1, points: item.points + card.points }
            : item
        )
      );
    } else {
      const newItem: RosterItem = {
        id: `roster-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        datacardId: card.id,
        name: card.name,
        points: card.points,
        count: 1,
        isWarlord: false
      };
      setRosterItems([...rosterItems, newItem]);
    }
    showNotice(`Added ${card.name} to roster.`);
  };

  // Remove or decrement a unit in the roster
  const removeUnitFromRoster = (itemId: string) => {
    const item = rosterItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.count > 1) {
      const card = activeFaction.units.find(u => u.id === item.datacardId);
      const unitPoints = card ? card.points : item.points / item.count;
      setRosterItems(
        rosterItems.map(i => 
          i.id === itemId 
            ? { ...i, count: i.count - 1, points: i.points - unitPoints }
            : i
        )
      );
    } else {
      setRosterItems(rosterItems.filter(i => i.id !== itemId));
    }
  };

  // Delete item entirely
  const deleteRosterItem = (itemId: string) => {
    setRosterItems(rosterItems.filter(i => i.id !== itemId));
  };

  // Set Warlord status
  const setWarlord = (itemId: string) => {
    const item = rosterItems.find(i => i.id === itemId);
    if (!item) return;

    // Check if datacard is character
    const card = activeFaction.units.find(u => u.id === item.datacardId);
    if (card?.type !== "Character") {
      showNotice("Only 'Character' units can be designated as the Warlord.");
      return;
    }

    setRosterItems(
      rosterItems.map(i => ({
        ...i,
        isWarlord: i.id === itemId
      }))
    );
    showNotice(`Designated ${item.name} as your Army Warlord.`);
  };

  // Calculate total points including character enhancements
  const pointsTotal = rosterItems.reduce((acc, item) => {
    const enhancementPoints = item.enhancementPoints || 0;
    return acc + item.points + (enhancementPoints * item.count);
  }, 0);

  // Set character enhancement helper
  const setEnhancement = (itemId: string, name: string, points: number) => {
    setRosterItems(
      rosterItems.map(i => 
        i.id === itemId 
          ? { 
              ...i, 
              enhancementName: name || undefined, 
              enhancementPoints: points || undefined 
            }
          : i
      )
    );
    if (name) {
      showNotice(`Equipped enhancement: ${name} (+${points} pts)`);
    } else {
      showNotice("Removed character enhancement.");
    }
  };

  // Real-time Legality Rules validation
  const validationRules = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Points Check
    if (pointsTotal > pointsLimit) {
      errors.push(`Points over limit: ${pointsTotal} / ${pointsLimit} pts.`);
    }

    // Rule 2: Warlord check
    const warlordItem = rosterItems.find(item => item.isWarlord);
    if (rosterItems.length > 0 && !warlordItem) {
      warnings.push("No Warlord designated. Exactly one 'Character' must be designated as Warlord.");
    }

    // Rule 3: Characters as warlords
    if (warlordItem) {
      const card = activeFaction.units.find(u => u.id === warlordItem.datacardId);
      if (card && card.type !== "Character") {
        errors.push(`Invalid Warlord: "${warlordItem.name}" is not a Character.`);
      }
    }

    // Rule 4: Rule of 3 / Rule of 6
    rosterItems.forEach(item => {
      const card = activeFaction.units.find(u => u.id === item.datacardId);
      if (card) {
        const maxLimit = card.type === "Battleline" ? 6 : 3;
        if (item.count > maxLimit) {
          errors.push(`Too many copies of "${item.name}": Max is ${maxLimit} (You have ${item.count}).`);
        }
      }
    });

    return { errors, warnings, valid: errors.length === 0 };
  };

  const { errors, warnings, valid } = validationRules();

  // Save roster to local storage
  const saveRoster = () => {
    if (!rosterName.trim()) {
      showNotice("Roster must have a name before saving.");
      return;
    }

    const newRoster: ArmyRoster = {
      id: rosterId || `roster-${Date.now()}`,
      name: rosterName,
      factionId: selectedFactionId,
      pointsLimit: pointsLimit,
      items: rosterItems,
      createdAt: new Date().toLocaleDateString(),
      detachmentName: detachmentName,
      selectedStratagemNames: selectedStratagemNames,
      selectedEnhancementNames: selectedEnhancementNames
    };

    let updatedList = [...savedRosters];
    const index = savedRosters.findIndex(r => r.id === newRoster.id);
    if (index >= 0) {
      updatedList[index] = newRoster;
    } else {
      updatedList.push(newRoster);
    }

    setSavedRosters(updatedList);
    localStorage.setItem("warhammer_40k_rosters", JSON.stringify(updatedList));
    setRosterId(newRoster.id);
    showNotice("Army Roster saved successfully!");
  };

  // Load a roster
  const loadRoster = (roster: ArmyRoster) => {
    setRosterId(roster.id);
    setRosterName(roster.name);
    setSelectedFactionId(roster.factionId);
    setPointsLimit(roster.pointsLimit);
    setRosterItems(roster.items);
    setDetachmentName(roster.detachmentName || "");
    setSelectedStratagemNames(roster.selectedStratagemNames || []);
    setSelectedEnhancementNames(roster.selectedEnhancementNames || []);
    showNotice(`Loaded "${roster.name}".`);
  };

  // Delete a saved roster from lists
  const deleteSavedRoster = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedRosters.filter(r => r.id !== id);
    setSavedRosters(updated);
    localStorage.setItem("warhammer_40k_rosters", JSON.stringify(updated));
    if (rosterId === id) {
      createNewRoster();
    }
    showNotice("Roster deleted.");
  };

  // Start fresh roster
  const createNewRoster = () => {
    setRosterId(null);
    setRosterName("New Combat Patrol");
    setRosterItems([]);
    setDetachmentName(activeFaction.detachment.name);
    setSelectedStratagemNames([]);
    setSelectedEnhancementNames([]);
    showNotice("Created new blank roster.");
  };

  // Generate shareable copy-paste markdown roster
  const generateExportText = () => {
    const wl = rosterItems.find(i => i.isWarlord);
    let md = `=========================================\n`;
    md += `WARHAMMER 40,000 ARMY ROSTER\n`;
    md += `=========================================\n`;
    md += `Army Name: ${rosterName}\n`;
    md += `Faction: ${activeFaction.name}\n`;
    md += `Detachment: ${detachmentName}\n`;
    md += `Stratagems Selected: ${selectedStratagemNames.length > 0 ? selectedStratagemNames.join(", ") : "None"}\n`;
    md += `Enhancements Selected: ${selectedEnhancementNames.length > 0 ? selectedEnhancementNames.join(", ") : "None"}\n`;
    md += `Points Cost: ${pointsTotal} / ${pointsLimit} pts\n`;
    md += `Army Legality Status: ${valid ? "VALID (Match Play Legal)" : "INVALID (Check Constraints)"}\n`;
    md += `Warlord: ${wl ? wl.name : "None designated"}\n`;
    md += `-----------------------------------------\n\n`;

    md += `CHARACTERS & HQ:\n`;
    const chars = rosterItems.filter(i => {
      const card = activeFaction.units.find(u => u.id === i.datacardId);
      return card?.type === "Character";
    });
    if (chars.length > 0) {
      chars.forEach(c => {
        const enhStr = c.enhancementName ? ` with ${c.enhancementName} (+${c.enhancementPoints} pts)` : "";
        const itemPoints = c.points + ((c.enhancementPoints || 0) * c.count);
        md += `- ${c.name} x${c.count} (${itemPoints} pts)${enhStr}${c.isWarlord ? " [WARLORD]" : ""}\n`;
      });
    } else {
      md += `  (No Characters selected)\n`;
    }
    md += `\n`;

    md += `OTHER DATASHEETS:\n`;
    const others = rosterItems.filter(i => {
      const card = activeFaction.units.find(u => u.id === i.datacardId);
      return card?.type !== "Character";
    });
    if (others.length > 0) {
      others.forEach(o => {
        md += `- ${o.name} x${o.count} (${o.points} pts)\n`;
      });
    } else {
      md += `  (No other units selected)\n`;
    }

    md += `\nCreated with Warhammer 40k Recruit Guide.`;

    const shareObj = {
      name: rosterName,
      factionId: selectedFactionId,
      pointsLimit: pointsLimit,
      items: rosterItems,
      detachmentName: detachmentName,
      selectedStratagemNames: selectedStratagemNames,
      selectedEnhancementNames: selectedEnhancementNames
    };

    try {
      const jsonStr = JSON.stringify(shareObj);
      const base64Code = btoa(unescape(encodeURIComponent(jsonStr)));
      md += `\n\n[SHARE_CODE:${base64Code}]`;
    } catch (err) {
      console.error("Failed to generate SHARE_CODE:", err);
    }

    setExportText(md);
    setShowExportModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportText);
    showNotice("Roster copied to clipboard!");
  };

  // Import custom army list from pasted text
  const handleImportRoster = (text: string) => {
    if (!text.trim()) {
      setImportError("Please paste some roster text first.");
      return;
    }

    // 1. Try to extract SHARE_CODE first for absolute 100% accurate precision
    const shareCodeRegex = /\[SHARE_CODE:([^\]]+)\]/;
    const match = text.match(shareCodeRegex);

    if (match && match[1]) {
      try {
        const decodedStr = decodeURIComponent(escape(atob(match[1].trim())));
        const parsed = JSON.parse(decodedStr);
        
        if (parsed && parsed.items) {
          // Validate faction
          const factionExists = FACTIONS.some(f => f.id === parsed.factionId);
          if (!factionExists) {
            throw new Error(`Unknown faction ID: ${parsed.factionId}`);
          }
          
          setRosterId(`roster-${Date.now()}`);
          setRosterName(parsed.name || "Imported Strike Force");
          setSelectedFactionId(parsed.factionId);
          setPointsLimit(parsed.pointsLimit || 1000);
          setRosterItems(parsed.items);
          setDetachmentName(parsed.detachmentName || "");
          setSelectedStratagemNames(parsed.selectedStratagemNames || []);
          setSelectedEnhancementNames(parsed.selectedEnhancementNames || []);
          
          showNotice("Roster imported successfully via Share Code!");
          setShowImportModal(false);
          setImportText("");
          setImportError(null);
          return;
        }
      } catch (err) {
        console.error("Failed to decode share code, falling back to text parsing...", err);
      }
    }

    // 2. Best-effort fallback human-readable text parsing
    try {
      const lines = text.split("\n");
      let tempRosterName = "Imported Strike Force";
      let tempFactionId = selectedFactionId; // Default to current
      let tempPointsLimit = pointsLimit;
      let tempDetachmentName = detachmentName;
      let tempStratagems: string[] = [];
      let tempEnhancements: string[] = [];
      const parsedItems: RosterItem[] = [];

      // Find faction first so we know what unit list to match against
      for (const line of lines) {
        const facMatch = line.match(/Faction:\s*(.+)$/i);
        if (facMatch) {
          const facName = facMatch[1].trim();
          const matchedFac = FACTIONS.find(f => 
            f.name.toLowerCase() === facName.toLowerCase() || 
            f.id.toLowerCase() === facName.toLowerCase().replace(/\s+/g, "_")
          );
          if (matchedFac) {
            tempFactionId = matchedFac.id;
          }
        }
      }

      const factionToMatch = FACTIONS.find(f => f.id === tempFactionId) || FACTIONS[0];

      for (const line of lines) {
        // Roster Name
        const nameMatch = line.match(/Army Name:\s*(.+)$/i);
        if (nameMatch) {
          tempRosterName = nameMatch[1].trim();
          continue;
        }

        // Points limit
        const limitMatch = line.match(/Points Cost:.*\/.*?(\d+)\s*pts/i);
        if (limitMatch) {
          const parsedLimit = parseInt(limitMatch[1]);
          if ([500, 1000, 1500, 2000].includes(parsedLimit)) {
            tempPointsLimit = parsedLimit;
          }
          continue;
        }

        // Detachment
        const detachMatch = line.match(/Detachment:\s*(.+)$/i);
        if (detachMatch) {
          tempDetachmentName = detachMatch[1].trim();
          continue;
        }

        // Stratagems
        const stratMatch = line.match(/Stratagems Selected:\s*(.+)$/i);
        if (stratMatch && stratMatch[1].trim().toLowerCase() !== "none") {
          const strats = stratMatch[1].split(",").map(s => s.trim());
          const validStrats = factionToMatch.detachment.stratagems.map(s => s.name);
          tempStratagems = strats.filter(s => validStrats.includes(s));
          continue;
        }

        // Enhancements
        const enhMatch = line.match(/Enhancements Selected:\s*(.+)$/i);
        if (enhMatch && enhMatch[1].trim().toLowerCase() !== "none") {
          const enhs = enhMatch[1].split(",").map(e => e.trim());
          const validEnhs = factionToMatch.detachment.enhancements.map(e => e.name);
          tempEnhancements = enhs.filter(e => validEnhs.includes(e));
          continue;
        }

        // Units: starts with "- Name xCount"
        if (line.trim().startsWith("- ")) {
          const cleanLine = line.trim().substring(2); // remove "- "
          
          // Match pattern: "Name xCount" or "Name x Count"
          const unitRegex = /^(.+?)\s*x\s*(\d+)/i;
          const uMatch = cleanLine.match(unitRegex);
          if (uMatch) {
            const unitRawName = uMatch[1].trim();
            const count = parseInt(uMatch[2]);
            
            // Search for this unit in faction's datacards
            const card = factionToMatch.units.find(u => 
              u.name.toLowerCase() === unitRawName.toLowerCase() ||
              u.name.toLowerCase().includes(unitRawName.toLowerCase()) ||
              unitRawName.toLowerCase().includes(u.name.toLowerCase())
            );

            if (card) {
              const isWarlord = cleanLine.includes("[WARLORD]");
              
              // Check if enhancement
              let enhancementName = undefined;
              let enhancementPoints = undefined;
              
              // e.g., "with Artisan Artificer (+15 pts)"
              const enhDetailMatch = cleanLine.match(/with\s+([^(]+?)\s*\(\+(\d+)\s*pts\)/i);
              if (enhDetailMatch) {
                const eName = enhDetailMatch[1].trim();
                const matchedEnh = factionToMatch.detachment.enhancements.find(e => e.name.toLowerCase() === eName.toLowerCase());
                if (matchedEnh) {
                  enhancementName = matchedEnh.name;
                  enhancementPoints = matchedEnh.points;
                }
              }

              parsedItems.push({
                id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                datacardId: card.id,
                name: card.name,
                points: card.points,
                count: count,
                isWarlord,
                enhancementName,
                enhancementPoints
              });
            }
          }
        }
      }

      if (parsedItems.length > 0) {
        setRosterId(`roster-${Date.now()}`);
        setRosterName(tempRosterName);
        setSelectedFactionId(tempFactionId);
        setPointsLimit(tempPointsLimit);
        setRosterItems(parsedItems);
        setDetachmentName(tempDetachmentName);
        setSelectedStratagemNames(tempStratagems);
        setSelectedEnhancementNames(tempEnhancements);

        showNotice(`Roster imported! Added ${parsedItems.length} units.`);
        setShowImportModal(false);
        setImportText("");
        setImportError(null);
      } else {
        setImportError("Could not parse any valid units or decode share code in the pasted text.");
      }
    } catch (err: any) {
      setImportError(`Failed to parse roster: ${err.message || err}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="army-builder-main">
      
      {/* Toast Notification banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-grim-card border border-amber-500/50 text-amber-300 font-mono text-[10px] uppercase tracking-wider px-4.5 py-3.5 rounded-lg shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* COLUMN 1: Roster Configuration & List Manager (3 Cols) */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        
        {/* Roster Config Card */}
        <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-stone-200 border-b border-grim-border pb-2.5 flex items-center justify-between font-display tracking-widest uppercase">
            <span>Roster Configuration</span>
            <button 
              id="new-roster-btn"
              onClick={createNewRoster}
              className="text-[10px] font-mono tracking-wider uppercase text-amber-500 hover:text-amber-400 flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Army Name</label>
            <input 
              id="roster-name-input"
              type="text"
              value={rosterName}
              onChange={(e) => setRosterName(e.target.value)}
              className="bg-grim-dark border border-grim-border rounded-lg px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Faction</label>
              <select
                id="roster-faction-select"
                value={selectedFactionId}
                onChange={(e) => {
                  setSelectedFactionId(e.target.value);
                  setRosterItems([]); // Reset items if switching faction
                  setExpandedCodexUnitIds({});
                  setExpandedActiveUnitIds({});
                }}
                className="bg-grim-dark border border-grim-border rounded-lg px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition font-mono cursor-pointer"
              >
                {FACTIONS.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Points Cap</label>
              <select
                id="roster-points-select"
                value={pointsLimit}
                onChange={(e) => setPointsLimit(parseInt(e.target.value))}
                className="bg-grim-dark border border-grim-border rounded-lg px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition font-mono cursor-pointer"
              >
                <option value={500}>500 pts (Combat Patrol)</option>
                <option value={1000}>1000 pts (Incursion)</option>
                <option value={1500}>1500 pts (Strike Force Light)</option>
                <option value={2000}>2000 pts (Strike Force)</option>
              </select>
            </div>
          </div>

          {/* Detachment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Detachment</label>
            <div className="bg-grim-dark border border-grim-border rounded-lg px-3 py-2.5 text-xs text-amber-300 font-mono">
              {activeFaction.detachment.name}
            </div>
          </div>

          {/* Stratagems Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Selected Stratagems</label>
            <div className="grid grid-cols-1 gap-1 max-h-[150px] overflow-y-auto p-1 bg-grim-dark border border-grim-border rounded-lg">
              {activeFaction.detachment.stratagems.map(strat => (
                <label key={strat.name} className="flex items-center gap-2 text-xs text-stone-300 hover:text-stone-100 cursor-pointer p-1">
                  <input
                    type="checkbox"
                    checked={selectedStratagemNames.includes(strat.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStratagemNames([...selectedStratagemNames, strat.name]);
                      } else {
                        setSelectedStratagemNames(selectedStratagemNames.filter(n => n !== strat.name));
                      }
                    }}
                    className="accent-amber-500"
                  />
                  {strat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Enhancements Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Selected Enhancements</label>
            <div className="grid grid-cols-1 gap-1 max-h-[150px] overflow-y-auto p-1 bg-grim-dark border border-grim-border rounded-lg">
              {activeFaction.detachment.enhancements.map(enhancement => (
                <label key={enhancement.name} className="flex items-center gap-2 text-xs text-stone-300 hover:text-stone-100 cursor-pointer p-1">
                  <input
                    type="checkbox"
                    checked={selectedEnhancementNames.includes(enhancement.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEnhancementNames([...selectedEnhancementNames, enhancement.name]);
                      } else {
                        setSelectedEnhancementNames(selectedEnhancementNames.filter(n => n !== enhancement.name));
                      }
                    }}
                    className="accent-amber-500"
                  />
                  {enhancement.name} ({enhancement.points} pts)
                </label>
              ))}
            </div>
          </div>

          <button
            id="save-roster-btn"
            onClick={saveRoster}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-mono py-3 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer mt-1 active:scale-95 border border-amber-600/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Army List</span>
          </button>
        </div>

        {/* Load Saved Rosters Card */}
        <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 text-sky-500" />
              <span>SAVED rosters ({savedRosters.length})</span>
            </span>
            <button
              onClick={() => {
                setImportError(null);
                setImportText("");
                setShowImportModal(true);
              }}
              className="text-[9px] font-mono tracking-wider uppercase text-amber-500 hover:text-amber-400 flex items-center gap-1.5 active:scale-95 cursor-pointer bg-slate-900 border border-slate-800 px-2 py-1 rounded"
              id="import-roster-btn"
            >
              <FileText className="w-3 h-3 text-amber-500" />
              <span>Import List</span>
            </button>
          </span>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto" id="saved-rosters-list">
            {savedRosters.length > 0 ? (
              savedRosters.map(roster => {
                const fac = FACTIONS.find(f => f.id === roster.factionId);
                const sumPoints = roster.items.reduce((a, i) => a + i.points, 0);
                return (
                  <div
                    key={roster.id}
                    id={`saved-roster-card-${roster.id}`}
                    onClick={() => loadRoster(roster)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left cursor-pointer transition active:scale-98 ${
                      rosterId === roster.id
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                        : "bg-grim-dark border-grim-border text-stone-300 hover:border-stone-800"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-bold text-xs truncate">{roster.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono truncate">{fac ? fac.name : "Unknown Faction"}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                        {sumPoints} pts
                      </span>
                      <button
                        onClick={(e) => deleteSavedRoster(roster.id, e)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-500 text-center py-4 italic">No saved lists in local storage yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* COLUMN 2: Select Units (4 Cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3 min-h-[400px]">
          <h3 className="text-xs font-bold text-stone-200 border-b border-grim-border pb-2.5 font-display uppercase tracking-widest">
            Browse Codex Units
          </h3>
          <p className="text-[11px] text-stone-400">Click a unit's name to view its full interactive datacard. Click the <span className="text-amber-400 font-bold font-mono">+</span> button to add it to your roster.</p>

          <div className="flex justify-between items-center bg-grim-dark border border-grim-border/55 rounded-lg p-2 text-[10px] font-mono">
            <span className="text-stone-400 pl-1">Datacards:</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => {
                  const updated: Record<string, boolean> = {};
                  activeFaction.units.forEach(u => {
                    updated[u.id] = true;
                  });
                  setExpandedCodexUnitIds(updated);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold text-amber-400 hover:text-amber-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded transition cursor-pointer active:scale-95"
              >
                <ChevronsDown className="w-3 h-3 shrink-0" />
                <span>Expand All</span>
              </button>
              <button 
                onClick={() => setExpandedCodexUnitIds({})}
                className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold text-stone-400 hover:text-stone-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded transition cursor-pointer active:scale-95"
              >
                <ChevronsUp className="w-3 h-3 shrink-0" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>
 
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[500px]" id="builder-available-units">
            {activeFaction.units.map(unit => {
              const isExpanded = !!expandedCodexUnitIds[unit.id];
              return (
                <div
                  key={unit.id}
                  id={`add-unit-card-${unit.id}`}
                  className={`flex flex-col p-3 bg-grim-dark border rounded-lg transition duration-150 ${
                    isExpanded 
                      ? "border-amber-500/50 bg-black/45 shadow-md" 
                      : "border-grim-border hover:border-stone-700 hover:bg-black/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div 
                      onClick={() => setExpandedCodexUnitIds(prev => ({ ...prev, [unit.id]: !prev[unit.id] }))}
                      className="flex flex-col gap-1 min-w-0 flex-1 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-stone-200 group-hover:text-amber-300 transition-colors font-sans truncate">
                          {unit.name}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono font-bold bg-grim-card text-sky-400 border border-sky-950 px-1.5 py-0.5 rounded">
                          {unit.type}
                        </span>
                        <span className="text-[9px] text-stone-500 font-mono truncate">{unit.squadSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="font-mono font-bold text-amber-400 text-xs bg-grim-card border border-grim-border px-1.5 py-0.5 rounded">
                        <span>{unit.points}</span>
                        <span className="text-[8px] text-stone-500 font-bold ml-0.5">PTS</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addUnitToRoster(unit);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-1 rounded transition active:scale-90 cursor-pointer flex items-center justify-center"
                        title="Add unit to roster"
                      >
                        <Plus className="w-4 h-4 font-black" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && renderFullDatacard(unit)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
 
      {/* COLUMN 3: Active Roster & Legal Validation (5 Cols) */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        
        {/* Active List Roster */}
        <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-4 min-h-[350px]">
          
          {/* Points Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end font-mono">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Points Calculation</span>
              <span className={`text-xs font-black tracking-widest ${pointsTotal > pointsLimit ? "text-red-400 animate-pulse" : "text-amber-400"}`}>
                {pointsTotal} / {pointsLimit} PTS
              </span>
            </div>
            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-grim-border flex">
              <div 
                className={`h-full transition-all duration-300 ${pointsTotal > pointsLimit ? "bg-red-500" : "bg-amber-500"}`}
                style={{ width: `${Math.min((pointsTotal / pointsLimit) * 100, 100)}%` }}
              />
            </div>
          </div>
 
          <h3 className="text-xs font-bold text-stone-200 border-b border-grim-border pb-2 flex items-center justify-between font-display tracking-widest uppercase">
            <span>Active Roster</span>
            <span className="text-[9px] bg-black border border-grim-border text-stone-400 px-2 py-0.5 rounded font-mono uppercase">
              {rosterItems.length} units
            </span>
          </h3>

          <div className="flex justify-between items-center bg-grim-dark border border-grim-border/55 rounded-lg p-2 text-[10px] font-mono">
            <span className="text-stone-400 pl-1">Datacards:</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => {
                  const updated: Record<string, boolean> = {};
                  rosterItems.forEach(item => {
                    updated[item.id] = true;
                  });
                  setExpandedActiveUnitIds(updated);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold text-amber-400 hover:text-amber-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded transition cursor-pointer active:scale-95"
              >
                <ChevronsDown className="w-3 h-3 shrink-0" />
                <span>Expand All</span>
              </button>
              <button 
                onClick={() => setExpandedActiveUnitIds({})}
                className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold text-stone-400 hover:text-stone-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded transition cursor-pointer active:scale-95"
              >
                <ChevronsUp className="w-3 h-3 shrink-0" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>
 
          {/* List items added */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-1" id="active-roster-items">
            {rosterItems.length > 0 ? (
              rosterItems.map(item => {
                const card = activeFaction.units.find(u => u.id === item.datacardId);
                const isCharacter = card?.type === "Character";
                const isExpanded = !!expandedActiveUnitIds[item.id];
                return (
                  <div
                    key={item.id}
                    className={`bg-grim-dark border rounded-lg p-3.5 flex flex-col gap-2 transition duration-150 ${
                      isExpanded 
                        ? "border-amber-500/50 bg-black/45 shadow-md" 
                        : "border-grim-border hover:border-stone-800 hover:bg-black/20"
                    }`}
                    id={`active-unit-${item.datacardId}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0 w-full pr-2">
                        {/* Expand/Collapse Header Toggle */}
                        <div 
                          onClick={() => setExpandedActiveUnitIds(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="flex items-center gap-1.5 cursor-pointer select-none group pb-1"
                        >
                          <span className="font-bold text-xs text-stone-200 group-hover:text-amber-300 transition-colors truncate">
                            {item.name}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300 shrink-0" />
                          )}
                        </div>

                        {isCharacter && (
                          <div className="flex flex-col gap-2 mt-2">
                            <button
                              onClick={() => setWarlord(item.id)}
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded self-start cursor-pointer active:scale-95 transition ${
                                item.isWarlord 
                                  ? "bg-amber-500 text-slate-950 border border-amber-400" 
                                  : "bg-grim-card text-stone-400 border border-grim-border hover:text-stone-200"
                              }`}
                            >
                              {item.isWarlord ? "★ WARLORD DESIGNATED" : "Set as Warlord"}
                            </button>
                            
                            <div className="flex flex-col gap-1 mt-1">
                              <span className="text-[8px] text-stone-500 font-mono uppercase tracking-widest font-bold">Enhancement / Relic</span>
                              <select
                                value={item.enhancementName || ""}
                                onChange={(e) => {
                                  const selectedName = e.target.value;
                                  const list = FACTION_ENHANCEMENTS[selectedFactionId] || [];
                                  const found = list.find(enh => enh.name === selectedName);
                                  setEnhancement(item.id, selectedName, found ? found.points : 0);
                                }}
                                className="bg-grim-card border border-grim-border text-[9px] font-mono p-1 rounded text-stone-300 focus:outline-none w-full cursor-pointer"
                              >
                                <option value="">(No Enhancement)</option>
                                {(FACTION_ENHANCEMENTS[selectedFactionId] || []).map((enh, idx) => (
                                  <option key={idx} value={enh.name}>
                                    {enh.name} (+{enh.points} pts)
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 ml-2 font-mono font-black text-amber-400 text-xs bg-grim-card border border-grim-border px-2 py-1 rounded shrink-0 self-start">
                        <span>{item.points + ((item.enhancementPoints || 0) * item.count)}</span>
                        <span className="text-[9px] text-stone-500">pts</span>
                      </div>
                    </div>
 
                    {/* Render live stats sheet if expanded */}
                    {isExpanded && card && renderFullDatacard(card)}

                    <div className="flex items-center justify-between border-t border-grim-border pt-2 mt-1">
                      <div className="flex items-center gap-1.5 bg-grim-card rounded border border-grim-border px-1.5 py-0.5">
                        <button
                          onClick={() => removeUnitFromRoster(item.id)}
                          className="text-stone-400 hover:text-amber-400 p-1 rounded transition active:scale-90 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-stone-200 px-1">{item.count}</span>
                        <button
                          onClick={() => card && addUnitToRoster(card)}
                          className="text-stone-400 hover:text-amber-400 p-1 rounded transition active:scale-90 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
 
                      <button
                        onClick={() => deleteRosterItem(item.id)}
                        className="text-stone-500 hover:text-red-400 p-1 rounded hover:bg-black/25 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-stone-500 text-xs border border-dashed border-grim-border rounded-lg bg-black/10">
                Your army list is currently empty. Add units from the Codex list.
              </div>
            )}
          </div>
 
          {rosterItems.length > 0 && (
            <button
              id="export-roster-btn"
              onClick={generateExportText}
              className="w-full bg-grim-dark border border-grim-border hover:border-amber-500/30 text-stone-300 hover:text-amber-400 text-xs font-bold py-3 rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2 uppercase tracking-wider font-mono"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Export Roster to Clipboard</span>
            </button>
          )}
        </div>
 
        {/* Real-time Legality Validation Card */}
        {rosterItems.length > 0 && (
          <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3 font-mono">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center justify-between border-b border-grim-border pb-2">
              <span>LEGALITY DIAGNOSTICS</span>
              <span className={`text-[8px] px-2 py-0.5 rounded font-black ${valid ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "bg-red-950/40 text-red-400 border border-red-500/20"}`}>
                {valid ? "MATCH PLAY LEGAL" : "UNSTABLE ROSTER"}
              </span>
            </span>
 
            <div className="flex flex-col gap-2 text-xs">
              {valid && warnings.length === 0 && (
                <div className="flex gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <p className="leading-relaxed font-sans text-stone-300 text-[11px]">Your army list complies perfectly with standard Warhammer 10th Edition matching play constraints!</p>
                </div>
              )}
 
              {errors.map((err, idx) => {
                let ruleKey = "";
                if (err.includes("Points over limit")) ruleKey = "points";
                if (err.includes("Invalid Warlord")) ruleKey = "warlord_invalid";
                if (err.includes("Too many copies")) ruleKey = "rule_of_3";
                return (
                  <div key={idx} className="flex flex-col gap-2 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg text-red-400">
                    <div className="flex gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
                      <span className="leading-tight text-[11px] font-sans text-stone-300">{err}</span>
                    </div>
                    {ruleKey && (
                      <button
                        onClick={() => setActiveDiagnosticRule(ruleKey)}
                        className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 hover:text-amber-300 font-mono self-start ml-6 border border-amber-500/25 px-2.5 py-1.5 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 active:scale-95 transition cursor-pointer uppercase tracking-wider"
                      >
                        <HelpCircle className="w-3 h-3 shrink-0" />
                        <span>Explain Rule & Fix</span>
                      </button>
                    )}
                  </div>
                );
              })}
 
              {warnings.map((warn, idx) => {
                let ruleKey = "";
                if (warn.includes("No Warlord designated")) ruleKey = "warlord_none";
                return (
                  <div key={idx} className="flex flex-col gap-2 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg text-amber-400">
                    <div className="flex gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                      <span className="leading-tight text-[11px] font-sans text-stone-300">{warn}</span>
                    </div>
                    {ruleKey && (
                      <button
                        onClick={() => setActiveDiagnosticRule(ruleKey)}
                        className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 hover:text-amber-300 font-mono self-start ml-6 border border-amber-500/25 px-2.5 py-1.5 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 active:scale-95 transition cursor-pointer uppercase tracking-wider"
                      >
                        <HelpCircle className="w-3 h-3 shrink-0" />
                        <span>Explain Rule & Fix</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
 
      </div>
 
      {/* Interactive Diagnostic Rule Explanation Dialog */}
      {activeDiagnosticRule && DIAGNOSTIC_RULES_EXPLAIN[activeDiagnosticRule] && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="diagnostic-modal">
          <div className="bg-grim-card border border-amber-500/40 rounded-xl p-6 max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-grim-border pb-2.5">
              <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded tracking-widest uppercase">
                RECRUIT RULES DIAGNOSTIC
              </span>
              <button 
                onClick={() => setActiveDiagnosticRule(null)}
                className="text-stone-500 hover:text-stone-300 text-[10px] font-mono uppercase tracking-widest cursor-pointer"
              >
                [Dismiss]
              </button>
            </div>
            
            <h4 className="text-xs font-bold text-stone-200 uppercase font-display tracking-widest text-amber-500">
              {DIAGNOSTIC_RULES_EXPLAIN[activeDiagnosticRule].title}
            </h4>
            
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              {DIAGNOSTIC_RULES_EXPLAIN[activeDiagnosticRule].text}
            </p>
            
            <div className="bg-grim-dark border border-grim-border p-3.5 rounded-lg flex flex-col gap-1">
              <span className="text-[8px] font-mono font-bold text-sky-400 uppercase tracking-widest">How to solve this:</span>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">{DIAGNOSTIC_RULES_EXPLAIN[activeDiagnosticRule].fix}</p>
            </div>
 
            <button
              onClick={() => setActiveDiagnosticRule(null)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-3 rounded-lg transition font-mono active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              GOT IT, RETURNING TO LIST BUILDER
            </button>
          </div>
        </div>
      )}
 
      {/* Export Share Roster Dialog/Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="export-modal">
          <div className="bg-grim-card border border-grim-border rounded-xl p-6 max-w-xl w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-grim-border pb-3">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-2 font-display uppercase tracking-wider">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Exported Warhammer Army List</span>
              </span>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-stone-500 hover:text-stone-300 text-xs font-mono bg-grim-dark border border-grim-border px-2 py-1 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed">Copy the text box below to easily share your tactical forces list with opponents or import into tournament catalogs.</p>
            
            <textarea
              id="export-textarea"
              readOnly
              value={exportText}
              className="w-full h-80 bg-black/40 border border-grim-border rounded-lg p-4 font-mono text-xs text-stone-300 focus:outline-none"
            />
 
            <button
              id="copy-roster-clipboard-btn"
              onClick={copyToClipboard}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer mt-1 active:scale-95 uppercase font-mono tracking-wider"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Roster Text</span>
            </button>
          </div>
        </div>
      )}

      {/* Import Roster Dialog/Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="import-modal">
          <div className="bg-grim-card border border-grim-border rounded-xl p-6 max-w-xl w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-grim-border pb-3">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-2 font-display uppercase tracking-wider">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Import Warhammer Army List</span>
              </span>
              <button 
                onClick={() => {
                  setShowImportModal(false);
                  setImportText("");
                  setImportError(null);
                }}
                className="text-stone-500 hover:text-stone-300 text-xs font-mono bg-grim-dark border border-grim-border px-2 py-1 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed">
              Paste an exported Warhammer army text summary below. The importer will automatically detect and parse either the share code or unit listings.
            </p>
            
            {importError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg leading-relaxed font-mono">
                <strong>Error:</strong> {importError}
              </div>
            )}

            <textarea
              id="import-textarea"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste roster text summary here..."
              className="w-full h-80 bg-black/40 border border-grim-border rounded-lg p-4 font-mono text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
            />
 
            <button
              id="submit-import-roster-btn"
              onClick={() => handleImportRoster(importText)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer mt-1 active:scale-95 uppercase font-mono tracking-wider"
            >
              <FileText className="w-4 h-4" />
              <span>Import & Load Roster</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
