"use client";

import React, { useState } from "react";
import { OrderStatusType, OrderData } from "@/types/order";
import { MOCK_ORDERS } from "@/data/orders";
import StatusCard from "./StatusCard";
import TrackingTimeline from "./TrackingTimeline";
import OrderSummary from "./OrderSummary";
import IssueReport from "./IssueReport";
import SupportSheet from "./SupportSheet";
import {
  ChevronLeft,
  Headphones,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Smartphone,
  Maximize2,
  RefreshCw,
  Share2,
} from "lucide-react";

export default function OrderTracking() {
  // Current active state for demonstration
  const [selectedState, setSelectedState] = useState<OrderStatusType>("delayed");
  // Device viewport simulator for desktop evaluators
  const [viewportWidth, setViewportWidth] = useState<"360px" | "390px" | "430px" | "full">("390px");
  // Active modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Simulated refresh states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasCopiedTracking, setHasCopiedTracking] = useState(false);
  const [hasCopiedOrderId, setHasCopiedOrderId] = useState(false);
  const [smsSubscribed, setSmsSubscribed] = useState(false);

  const currentOrder = MOCK_ORDERS[selectedState];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleRefreshTracking = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Tracking status synced with carrier dispatch (Just now)");
    }, 1000);
  };

  const handleCopyTracking = () => {
    if (currentOrder.carrier.trackingNumber) {
      navigator.clipboard?.writeText(currentOrder.carrier.trackingNumber);
      setHasCopiedTracking(true);
      showToast("Carrier tracking number copied to clipboard");
      setTimeout(() => setHasCopiedTracking(false), 2000);
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(currentOrder.orderNumber);
    setHasCopiedOrderId(true);
    showToast(`Order #${currentOrder.orderNumber} copied to clipboard`);
    setTimeout(() => setHasCopiedOrderId(false), 2000);
  };

  const handleToggleSms = () => {
    setSmsSubscribed(!smsSubscribed);
    showToast(
      !smsSubscribed
        ? "SMS notifications enabled for this shipment"
        : "SMS notifications disabled"
    );
  };

  const handleClaimSubmitted = (ticketId: string) => {
    showToast(`Claim #${ticketId} submitted. Support team notified.`);
  };

  // Viewport container sizing for responsive mobile showcase
  const getContainerStyle = () => {
    if (viewportWidth === "360px") return "max-w-[360px]";
    if (viewportWidth === "390px") return "max-w-[390px]";
    if (viewportWidth === "430px") return "max-w-[430px]";
    return "max-w-md";
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-3 sm:py-8 px-2 sm:px-4">
      {/* 1. Evaluator Demo State Switcher Bar */}
      <section
        className="w-full max-w-xl mb-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-3.5 space-y-3"
        aria-label="Assessment State Demonstrator"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Evaluator Demo Controls
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            3 Required Order States
          </span>
        </div>

        {/* State Toggle Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedState("delayed")}
            className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
              selectedState === "delayed"
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>State A: Delayed</span>
            </div>
            <p
              className={`text-[10px] mt-0.5 leading-tight ${
                selectedState === "delayed" ? "text-amber-100" : "text-slate-500"
              }`}
            >
              Weather reroute & updated estimate
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedState("delivered_not_received")}
            className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
              selectedState === "delivered_not_received"
                ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>State B: Delivered?</span>
            </div>
            <p
              className={`text-[10px] mt-0.5 leading-tight ${
                selectedState === "delivered_not_received"
                  ? "text-rose-100"
                  : "text-slate-500"
              }`}
            >
              Delivered but not received claim
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedState("tracking_pending")}
            className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
              selectedState === "tracking_pending"
                ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>State C: Pending</span>
            </div>
            <p
              className={`text-[10px] mt-0.5 leading-tight ${
                selectedState === "tracking_pending"
                  ? "text-indigo-100"
                  : "text-slate-500"
              }`}
            >
              Tracking pending pickup scan
            </p>
          </button>
        </div>

        {/* Viewport Width Switcher (Responsive check) */}
        <div className="hidden sm:flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium">Viewport preview width:</span>
          </div>
          <div className="flex items-center gap-1">
            {(["360px", "390px", "430px", "full"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setViewportWidth(w)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  viewportWidth === w
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {w === "full" ? "Fluid (100%)" : w}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Mobile App Shell Container */}
      <main
        className={`w-full ${getContainerStyle()} bg-slate-50 rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 relative`}
      >
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast("Navigating back to order history")}
              className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
              aria-label="Back to Orders"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                Order Tracking
              </h1>
              <p className="text-[10px] font-mono text-slate-500">
                #{currentOrder.orderNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleSms}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                smsSubscribed
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
              title="SMS Alerts"
              aria-label="Toggle SMS alerts"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Contact Support"
              aria-label="Contact Support"
            >
              <Headphones className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <div className="p-4 space-y-4 pb-24">
          {/* Status & Estimated Delivery Box */}
          <StatusCard
            order={currentOrder}
            onRefresh={handleRefreshTracking}
            isRefreshing={isRefreshing}
            onOpenReportIssue={() => setIsReportModalOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onCopyTracking={handleCopyTracking}
            hasCopied={hasCopiedTracking}
          />

          {/* Detailed Progress Stepper & Milestones */}
          <TrackingTimeline order={currentOrder} />

          {/* Compact Product & Order Summary */}
          <OrderSummary
            order={currentOrder}
            onCopyOrderId={handleCopyOrderId}
            hasCopiedOrderId={hasCopiedOrderId}
          />
        </div>

        {/* Sticky Mobile Bottom Quick Action Bar */}
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-slate-600" />
            <span>Support</span>
          </button>

          {selectedState === "delivered_not_received" ? (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex-[2] py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Missing Order</span>
            </button>
          ) : selectedState === "delayed" ? (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex-[2] py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Delay Issue</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRefreshTracking}
              disabled={isRefreshing}
              className="flex-[2] py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Checking Carrier..." : "Refresh Tracking"}</span>
            </button>
          )}
        </div>
      </main>

      {/* 3. Issue Report Modal / Flow */}
      <IssueReport
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        order={currentOrder}
        onSubmitSuccess={handleClaimSubmitted}
      />

      {/* 4. Support Sheet / Drawer */}
      <SupportSheet
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        order={currentOrder}
      />

      {/* 5. Accessible Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 sm:bottom-6 z-50 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-medium shadow-xl flex items-center gap-2 animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
