/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";

interface ChatMessage {
  sender: "user" | "sage";
  text: string;
}

const QUICK_QUESTIONS = [
  "How does a Battle-shock test work?",
  "How do Saves and AP (Armor Penetration) interact?",
  "What is an Invulnerable Save?",
  "Explain the Fights First rules in melee.",
  "How does line of sight work for Shooting?"
];

export default function RulesSage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "sage",
      text: "Greetings, recruit! I am the Codex Rules Sage, powered by Gemini AI. I possess extensive knowledge of Warhammer 40,000 10th Edition core rules, factions, and tactics. Ask me anything—from phase details to rule disputes—and I will guide you!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Add user message
    const userMsg: ChatMessage = { sender: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/rules-sage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend })
      });

      if (!response.ok) {
        throw new Error("Failed to contact Rules Sage");
      }

      const data = await response.json();
      const sageMsg: ChatMessage = { sender: "sage", text: data.reply || "I apologize, recruit, my psychic link with the warp was momentarily interrupted. Please try asking again." };
      setMessages(prev => [...prev, sageMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: "sage",
          text: "I am having difficulty channeling the Warp right now. Please ensure your host connection is stable and try your inquiry again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-grim-card border border-grim-border rounded-xl shadow-2xl flex flex-col h-[620px]" id="rules-sage-container">
      
      {/* Sage Header */}
      <div className="p-4.5 border-b border-grim-border flex items-center justify-between bg-black/40 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-200 font-display tracking-widest uppercase">Sacred Imperial Rules Sage</h3>
            <span className="text-[9px] text-amber-400 font-mono tracking-widest flex items-center gap-1.5 font-bold mt-0.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              <span>LOGOS COGITATOR ACTIVE</span>
            </span>
          </div>
        </div>
        <span className="text-[9px] text-stone-500 font-mono hidden sm:inline uppercase tracking-widest border border-stone-800/60 px-2 py-0.5 rounded bg-black/25">WARHAMMER 10TH ED PROTOCOL</span>
      </div>

      {/* Chat Messages viewport */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-4.5 bg-gradient-to-b from-black/20 to-transparent" 
        id="sage-chat-history"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === "user" ? "self-end items-end" : "self-start items-start"
            }`}
          >
            {/* Bubble */}
            <div
              className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap shadow-lg transition-all ${
                msg.sender === "user"
                  ? "bg-amber-500 text-slate-950 font-bold rounded-tr-none border border-amber-400/20"
                  : "bg-grim-dark border border-grim-border text-stone-300 rounded-tl-none font-sans"
              }`}
            >
              {msg.text}
            </div>
            {/* Sender tag */}
            <span className="text-[8px] text-stone-500 font-mono mt-1.5 px-1 uppercase tracking-widest">
              {msg.sender === "user" ? "RECRUIT INITIATE" : "SACRED SAGE CORES"}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start max-w-[85%] self-start" id="sage-loading-bubble">
            <div className="p-4 bg-grim-dark border border-amber-500/20 text-stone-400 rounded-xl rounded-tl-none flex items-center gap-2.5 text-xs font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span className="tracking-wide">CONSULTING SACRED CODEX STACKS...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions Board - Hidden if keyboard active / space limited */}
      <div className="px-4.5 py-3.5 border-t border-grim-border bg-black/30" id="quick-questions-board">
        <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-2">PROPOSE TACTICAL QUERY:</span>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none" id="quick-questions-scroll">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              id={`quick-q-btn-${idx}`}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="flex items-center gap-2 text-[9px] font-mono tracking-wider uppercase bg-grim-dark border border-grim-border hover:border-amber-500/30 text-stone-400 hover:text-amber-400 px-3.5 py-2 rounded-lg shrink-0 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <div className="p-4 border-t border-grim-border bg-black/40 rounded-b-xl">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            id="sage-message-input"
            type="text"
            placeholder="Query tactical rules (e.g. 'Armor Penetration logic' or 'Melee combat order')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className="flex-1 bg-grim-dark border border-grim-border rounded-lg px-4 py-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition disabled:opacity-50 font-sans"
          />
          <button
            id="sage-send-btn"
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:bg-stone-850 text-slate-950 disabled:text-stone-600 px-4 rounded-lg transition cursor-pointer active:scale-95 shrink-0 flex items-center justify-center border border-amber-600/30 disabled:border-transparent"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
