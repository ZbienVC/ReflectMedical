import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
}

const KNOWLEDGE_BASE = [
  {
    keywords: ["botox", "neurotoxin", "wrinkle"],
    response:
      "Botox at Reflect Medical starts at $15/unit (reg. price). As a member, you pay as low as $9/unit! A typical forehead treatment uses 20-40 units. Would you like to book a consultation?",
  },
  {
    keywords: ["filler", "juvederm", "lips", "cheeks"],
    response:
      "We offer a full range of dermal fillers including Juvéderm, Restylane, Belotero, Radiesse, and Versa. Fillers start at $650/syringe. Evolve and Transform members save $75-$150 per syringe. Interested in booking?",
  },
  {
    keywords: ["membership", "join", "plan", "tier", "core", "evolve", "transform"],
    response:
      "We have 3 membership tiers:\n\n• Core: $79/mo → $99 Beauty Bank\n• Evolve: $129/mo → $150 Beauty Bank ⭐ Most Popular\n• Transform: $199/mo → $250 Beauty Bank\n\nAll include member pricing on treatments. Would you like to sign up?",
  },
  {
    keywords: ["price", "cost", "how much", "pricing"],
    response:
      "Our pricing varies by treatment. As a member, you get significant discounts:\n• Botox from $9-$12/unit\n• Fillers: save $75-$150/syringe\n• Chemical Peels: save 10-30%\n\nVisit our Treatments page to see full pricing, or ask about a specific treatment!",
  },
  {
    keywords: ["appointment", "book", "schedule", "availability"],
    response:
      "We offer same-day appointments! Our hours are:\n• Mon: 9am-7pm\n• Tue: 9am-2pm\n• Wed-Thu: 9am-5pm\n• Fri: 9am-4pm\n\nClick 'Book Appointment' above or call (201) 882-1050!",
  },
  {
    keywords: ["location", "address", "where", "directions", "hawthorne"],
    response:
      "We're located at 150 Lafayette Ave, Hawthorne, NJ 07506. Easy parking available! You can get directions on Google Maps or call us at (201) 882-1050.",
  },
  {
    keywords: ["laser", "hair removal", "lhr"],
    response:
      "We specialize in Laser Hair Removal for all skin tones, including skin of color! Sessions start at $150. We're currently offering 50% off your first session for new patients. Book a free consultation to get started!",
  },
  {
    keywords: ["beauty bank", "credits", "balance", "points"],
    response:
      "The Beauty Bank is our monthly credit system. When you're a member, credits auto-load to your account each month and can be used toward any treatment. Unused credits roll over while your membership is active!",
  },
  {
    keywords: ["leah", "provider", "doctor", "pa", "staff"],
    response:
      "Leah Bienstock, PA-C is our founder and lead aesthetic injector with 8+ years of experience. She's known for her gentle touch, incredible eye for detail, and natural-looking results. Dr. Douglas Bienstock, DO handles our medical services.",
  },
  {
    keywords: ["gift", "gift card", "present"],
    response:
      "Yes! We offer gift cards in amounts from $50-$250. They can be sent instantly by email or text. Perfect for birthdays, holidays, or just treating someone special. Visit our Gift Cards page to purchase!",
  },
  {
    keywords: ["cancel", "pause", "freeze", "membership"],
    response:
      "You can pause your membership for 1-3 months from your Settings page. Your Beauty Bank credits freeze during the pause and no charges are made. You can also cancel anytime from Settings.",
  },
];

const DEFAULT_RESPONSES = [
  "Great question! For specific details, please call us at (201) 882-1050 or book a free consultation.",
  "I'd love to help with that! Our team at (201) 882-1050 can give you the most accurate information.",
  "That's something our providers would be happy to discuss during a consultation. Would you like to book one?",
];

const WELCOME_MESSAGE =
  "Hi! 👋 I'm the Reflect Medical assistant. Ask me about our treatments, membership plans, pricing, or how to book an appointment!";

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "bot", text: botResponse },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ maxHeight: "540px" }}>
          {/* Header */}
          <div className="bg-violet-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-sm">Reflect Medical Assistant</p>
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-green-300 text-xs">Online</span>
              </div>
              <p className="text-violet-200 text-xs">Ask me about treatments, membership, or booking</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "384px" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
