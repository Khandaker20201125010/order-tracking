"use client";

import React, { useState } from "react";
import { OrderData } from "@/types/order";
import {
  X,
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  Bot,
  User,
} from "lucide-react";

interface SupportSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function SupportSheet({
  isOpen,
  onClose,
  order,
}: SupportSheetProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "channels" | "faq">("chat");
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: `Hello! I'm SwiftBot, your logistics concierge. I have your order #${order.orderNumber} pulled up. How can I assist you today?`,
      timestamp: "Just now",
    },
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsBotTyping(true);

    setTimeout(() => {
      let botResponse = `I have logged your inquiry regarding ${order.carrier.name} tracking (${order.carrier.trackingNumber}). Our human logistics agent is also reviewing the latest hub dispatch logs.`;

      if (text.toLowerCase().includes("delay") || text.toLowerCase().includes("weather")) {
        botResponse = `For Order #${order.orderNumber}, our transport team rerouted the transit convoy due to regional weather warnings. The revised arrival window is ${order.estimate.displayDate}. Your package is safe in temperature-controlled transit.`;
      } else if (text.toLowerCase().includes("delivered") || text.toLowerCase().includes("missing")) {
        botResponse = `I understand you haven't received your package yet even though the driver recorded a delivery scan. We've initiated a direct GPS trace with ${order.carrier.name}. You can also submit an instant replacement claim using the 'I Didn't Receive This Order' button.`;
      } else if (text.toLowerCase().includes("tracking") || text.toLowerCase().includes("pending")) {
        botResponse = `Your order is currently with our fulfillment center packaging team. Carrier tracking links update as soon as the package receives its physical vehicle barcode scan (estimated today by 8:00 PM).`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "bot",
          text: botResponse,
          timestamp: "Just now",
        },
      ]);
      setIsBotTyping(false);
    }, 1000);
  };

  const faqs = [
    {
      q: "What causes shipment delays in transit?",
      a: "Unpredictable severe weather, highway road closures, or hub sorting bottlenecks can trigger precautionary safety delays. Carriers update timestamps as soon as the vehicle moves to the next checkpoint.",
    },
    {
      q: "Why does it say Delivered if I don't have it?",
      a: "Occasionally, drivers scan parcels slightly before stepping up to the porch or leave them in alternate sheltered spots (e.g. side gates, mailroom locker, reception). If it doesn't appear after 1–2 hours, file a claim immediately.",
    },
    {
      q: "When does tracking become active for new orders?",
      a: "Tracking numbers activate after our warehouse seals the box and the courier scans the pallet onto their regional truck, typically within 12–24 business hours.",
    },
    {
      q: "What is SwiftCart's Lost Package Guarantee?",
      a: "All items shipped via SwiftCart are 100% insured. If a package is confirmed misplaced or lost in transit, we immediately dispatch a free expedited replacement or issue a full refund.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-sheet-title"
    >
      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] sm:h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 id="support-sheet-title" className="text-sm font-bold text-slate-900">
                Customer Support & Concierge
              </h3>
              <p className="text-[11px] text-slate-500">
                Live help for Order #{order.orderNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close support sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-white px-5 pt-2 gap-4 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "chat"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Live Assistant
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("channels")}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "channels"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Direct Channels
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "faq"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Delivery FAQs
          </button>
        </div>

        {/* Tab 1: Live Chat */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-xs"
                        : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[10px] block mt-1 ${
                        msg.sender === "user" ? "text-indigo-200 text-right" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isBotTyping && (
                <div className="flex gap-2 items-center text-xs text-slate-500 pl-9">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">SwiftBot is analyzing carrier log...</span>
                </div>
              )}
            </div>

            {/* Suggested Quick Prompts */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => handleSendMessage("Where is my package right now?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Where is package?
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Why was delivery delayed?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Why the delay?
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("I want to speak with a human agent")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Human agent
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your order status..."
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-indigo-600"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isBotTyping}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Contact Channels */}
        {activeTab === "channels" && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Priority Phone Line</h4>
                  <p className="text-[11px] text-slate-500">Fast connection for in-transit orders</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-800">1-800-555-0192</span>
                <a
                  href="tel:18005550192"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Carrier Logistics Desk</h4>
                  <p className="text-[11px] text-slate-500">Direct courier dispatch escalation</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">{order.carrier.name} ({order.carrier.phone || "1-800-463-3339"})</span>
                <span className="text-[11px] text-slate-400">Hours: 24/7</span>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 text-xs text-indigo-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Buyer Protection Commitment</strong>
                <p className="text-[11px] text-indigo-900/80 leading-relaxed mt-0.5">
                  Every order is backed by SwiftCart Buyer Protection. We guarantee safe delivery or a full replacement at no expense.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Delivery FAQ */}
        {activeTab === "faq" && (
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isItemExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isItemExpanded ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-2 text-xs font-semibold text-slate-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isItemExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isItemExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
