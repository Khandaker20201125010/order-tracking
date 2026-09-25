"use client";

import React, { useState } from "react";
import { OrderData, TrackingEvent } from "@/types/order";
import {
  Check,
  Clock,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Building2,
  Sparkles,
} from "lucide-react";

interface TrackingTimelineProps {
  order: OrderData;
}

export default function TrackingTimeline({ order }: TrackingTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Stepper representation for high-level scanning
  const steps = [
    { key: "order_placed", label: "Ordered" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "out_for_delivery", label: "In Transit" },
    { key: "delivered", label: "Delivered" },
  ];

  // Determine current active step index based on order status
  let activeStepIndex = 1;
  if (order.stateType === "tracking_pending") {
    activeStepIndex = 1; // Processing
  } else if (order.stateType === "delayed") {
    activeStepIndex = 3; // In Transit / Out for Delivery
  } else if (order.stateType === "delivered_not_received") {
    activeStepIndex = 4; // Delivered
  }

  // Get icon according to stage and state
  const getTimelineIcon = (event: TrackingEvent) => {
    if (event.isDelayedIssue) {
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
    if (event.state === "completed") {
      return <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />;
    }
    if (event.state === "current") {
      if (event.stage === "processing") return <Package className="w-3.5 h-3.5 text-indigo-600 animate-bounce" />;
      if (event.stage === "out_for_delivery") return <Truck className="w-3.5 h-3.5 text-amber-600 animate-pulse" />;
      if (event.stage === "delivered") return <MapPin className="w-3.5 h-3.5 text-rose-600" />;
      return <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" />;
    }
    return <div className="w-2 h-2 rounded-full bg-slate-300" />;
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-6" aria-label="Tracking Progress and Milestones">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Delivery Journey</h3>
          <p className="text-xs text-slate-500">Live carrier checkpoints and milestone history</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Collapse" : "Expand"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 1. High-Level Progress Stepper Bar (Visual glance) */}
      <div className="pt-1 pb-2">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Rail */}
          <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
          
          {/* Active Highlight Rail */}
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 h-1 -z-0 transition-all duration-500 ${
              order.stateType === "delayed"
                ? "bg-amber-500"
                : order.stateType === "delivered_not_received"
                ? "bg-emerald-500"
                : "bg-indigo-500"
            }`}
            style={{
              width: `${(activeStepIndex / (steps.length - 1)) * 95}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;
            const isUpcoming = idx > activeStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center group relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : isCurrent
                      ? order.stateType === "delayed"
                        ? "bg-amber-500 text-white ring-4 ring-amber-100"
                        : order.stateType === "delivered_not_received"
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                        : "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-[11px] font-medium tracking-tight text-center ${
                    isCurrent
                      ? "font-bold text-slate-900"
                      : isCompleted
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Milestone Event Feed */}
      {isExpanded && (
        <div className="relative pt-2 pl-2">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[19px] top-4 bottom-5 w-0.5 bg-slate-200" />

          <div className="space-y-6">
            {order.timeline.map((event, idx) => {
              const isEventCompleted = event.state === "completed";
              const isEventCurrent = event.state === "current";
              const isEventUpcoming = event.state === "upcoming";

              return (
                <div
                  key={event.id || idx}
                  className={`relative flex items-start gap-4 transition-all duration-200 ${
                    isEventUpcoming ? "opacity-60" : "opacity-100"
                  }`}
                >
                  {/* Milestone Icon Node */}
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      event.isDelayedIssue
                        ? "bg-amber-100 border-2 border-amber-500 shadow-sm"
                        : isEventCompleted
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : isEventCurrent
                        ? "bg-white border-2 border-indigo-600 shadow-sm"
                        : "bg-slate-100 border border-slate-300 text-slate-400"
                    }`}
                  >
                    {getTimelineIcon(event)}
                  </div>

                  {/* Milestone Details Card */}
                  <div
                    className={`flex-1 rounded-xl p-3 text-left transition-colors ${
                      event.isDelayedIssue
                        ? "bg-amber-50/90 border border-amber-200"
                        : isEventCurrent
                        ? "bg-slate-50 border border-slate-200/80 shadow-2xs"
                        : "hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                      <h4
                        className={`text-xs sm:text-sm font-semibold ${
                          event.isDelayedIssue
                            ? "text-amber-950 font-bold"
                            : isEventCurrent
                            ? "text-slate-900 font-bold"
                            : "text-slate-800"
                        }`}
                      >
                        {event.title}
                      </h4>
                      <time className="text-[11px] font-medium text-slate-500">
                        {event.timestamp}
                      </time>
                    </div>

                    <p className="text-xs text-slate-600 mb-1 leading-relaxed">
                      {event.subtitle}
                    </p>

                    {event.location && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.notes && (
                      <div
                        className={`mt-2 text-[11px] p-2 rounded-lg font-medium leading-relaxed ${
                          event.isDelayedIssue
                            ? "bg-amber-100/70 text-amber-900 border border-amber-200/60"
                            : "bg-white border border-slate-200/60 text-slate-700"
                        }`}
                      >
                        {event.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
