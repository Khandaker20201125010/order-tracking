"use client";

import React, { useState } from "react";
import { OrderData } from "@/types/order";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Truck,
  MapPin,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";

interface StatusCardProps {
  order: OrderData;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenReportIssue: () => void;
  onOpenSupport: () => void;
  onCopyTracking: () => void;
  hasCopied: boolean;
}

export default function StatusCard({
  order,
  onRefresh,
  isRefreshing,
  onOpenReportIssue,
  onOpenSupport,
  onCopyTracking,
  hasCopied,
}: StatusCardProps) {
  const [showTips, setShowTips] = useState(false);
  const isDelayed = order.stateType === "delayed";
  const isDeliveredNotReceived = order.stateType === "delivered_not_received";
  const isPending = order.stateType === "tracking_pending";

  return (
    <section className="space-y-4" aria-label="Current Order Status and Estimate">
      {/* 1. Main Status Card */}
      <div
        className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 ${
          isDelayed
            ? "border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-amber-100/30 text-amber-950"
            : isDeliveredNotReceived
            ? "border-rose-200/80 bg-gradient-to-b from-rose-50/90 to-rose-100/30 text-rose-950"
            : "border-indigo-200/80 bg-gradient-to-b from-indigo-50/90 to-indigo-100/30 text-indigo-950"
        }`}
      >
        {/* Status Badge & Last Updated */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-xs ${
                isDelayed
                  ? "bg-amber-600 text-white"
                  : isDeliveredNotReceived
                  ? "bg-rose-600 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {isDelayed && <AlertTriangle className="w-3.5 h-3.5" />}
              {isDeliveredNotReceived && <ShieldAlert className="w-3.5 h-3.5" />}
              {isPending && <Clock className="w-3.5 h-3.5" />}
              {order.status.badgeText}
            </span>

            {order.status.contextPill && (
              <span
                className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  isDelayed
                    ? "border-amber-300 bg-amber-100/60 text-amber-800"
                    : isDeliveredNotReceived
                    ? "border-rose-300 bg-rose-100/60 text-rose-800"
                    : "border-indigo-300 bg-indigo-100/60 text-indigo-800"
                }`}
              >
                {order.status.contextPill}
              </span>
            )}
          </div>

          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {order.status.lastChecked}
          </span>
        </div>

        {/* Primary Headline & Explanation */}
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
            {order.status.headline}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {order.status.explanation}
          </p>
        </div>

        {/* State A: Specific Delay Notification Callout */}
        {isDelayed && (
          <div className="mt-4 rounded-xl bg-white/90 border border-amber-200/90 p-3.5 shadow-2xs space-y-2">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-amber-900">Why is this delayed? </span>
                {order.estimate.delayReason}
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-[11px] text-amber-800 font-medium">
              <span>Original scheduled: <del className="text-slate-400 font-normal">{order.estimate.originalDate}</del></span>
              <span className="text-amber-700 font-semibold">{order.estimate.updatedNote}</span>
            </div>
          </div>
        )}

        {/* State B: Delivered but not received callout + guidance checklist */}
        {isDeliveredNotReceived && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-white/95 border border-rose-200 p-3.5 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-900">
                    Carrier Drop-off Note:
                  </div>
                  <p className="text-slate-600">
                    {order.deliveryProof?.dropLocation} • {order.deliveryProof?.carrierNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Missing Package Quick Guide Toggle */}
            <div className="rounded-xl bg-rose-100/50 border border-rose-200/60 p-3">
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="w-full flex items-center justify-between text-xs font-semibold text-rose-900 cursor-pointer"
                aria-expanded={showTips}
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                  Package says delivered, but you can&apos;t find it?
                </span>
                <span className="text-[11px] text-rose-700 underline font-normal">
                  {showTips ? "Hide steps" : "View quick steps"}
                </span>
              </button>

              {showTips && order.missingPackageTips && (
                <ul className="mt-2.5 pt-2 border-t border-rose-200/50 space-y-1.5 text-[11px] text-slate-700 leading-normal">
                  {order.missingPackageTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Direct Problem Resolution Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenReportIssue}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                I Didn&apos;t Receive This Order
              </button>
              <button
                type="button"
                onClick={onOpenSupport}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-900 font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}

        {/* State C: Tracking Pending Callout */}
        {isPending && (
          <div className="mt-4 rounded-xl bg-white/95 border border-indigo-200/90 p-3.5 shadow-2xs space-y-2">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-indigo-950">
                  {order.pendingTrackingMessage?.estimatedAvailableTime}
                </div>
                <p className="text-slate-600">
                  {order.pendingTrackingMessage?.warehouseStatus}
                </p>
              </div>
            </div>
            <div className="text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg font-medium">
              💡 Tracking numbers typically become scannable once handed over to the courier vehicle.
            </div>
          </div>
        )}
      </div>

      {/* 2. Prominent Estimated Delivery Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {isDeliveredNotReceived ? "Delivered At" : isDelayed ? "Updated Estimated Delivery" : "Estimated Delivery"}
            </span>

            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {order.estimate.displayDate}
              </span>
              {order.estimate.displayTime && (
                <span className="text-sm font-semibold text-slate-600">
                  {order.estimate.displayTime}
                </span>
              )}
            </div>

            {isDelayed && order.estimate.originalDate && (
              <p className="text-xs text-slate-500">
                Original expected: <span className="line-through">{order.estimate.originalDate}</span>{" "}
                <span className="text-amber-700 font-medium"> (Delayed)</span>
              </p>
            )}

            {isPending && (
              <p className="text-xs text-slate-500 font-medium">
                Standard delivery timeframe: <span className="text-indigo-600">2–3 business days</span>
              </p>
            )}
          </div>

          {/* Quick status icon badge */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDelayed
                ? "bg-amber-100 text-amber-700"
                : isDeliveredNotReceived
                ? "bg-rose-100 text-rose-700"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {isDelayed ? (
              <Truck className="w-6 h-6" />
            ) : isDeliveredNotReceived ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* Carrier Info & Interactive Refresh Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{order.carrier.name}</span>
            <span className="text-slate-300">•</span>
            {isPending ? (
              <span className="italic text-slate-500">Tracking code pending pickup</span>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md font-mono text-[11px] text-slate-700">
                <span>{order.carrier.trackingNumber}</span>
                <button
                  type="button"
                  onClick={onCopyTracking}
                  aria-label="Copy tracking number"
                  className="hover:text-slate-900 transition-colors p-0.5 rounded cursor-pointer"
                  title="Copy tracking number"
                >
                  {hasCopied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors font-medium text-xs disabled:opacity-50 cursor-pointer"
              aria-label="Refresh tracking data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
              <span>{isRefreshing ? "Updating..." : "Refresh"}</span>
            </button>

            {!isPending && order.carrier.trackingUrl && (
              <a
                href={order.carrier.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-xs font-medium"
              >
                <span>Carrier Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
