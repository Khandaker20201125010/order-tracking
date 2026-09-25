"use client";

import React, { useState } from "react";
import { OrderData } from "@/types/order";
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface IssueReportProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData;
  onSubmitSuccess: (ticketId: string) => void;
}

export default function IssueReport({
  isOpen,
  onClose,
  order,
  onSubmitSuccess,
}: IssueReportProps) {
  const isDeliveredNotReceived = order.stateType === "delivered_not_received";
  const [issueType, setIssueType] = useState(
    isDeliveredNotReceived ? "not_received" : "transit_delay"
  );
  const [checkedNeighbors, setCheckedNeighbors] = useState(true);
  const [resolutionPreference, setResolutionPreference] = useState("replacement");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedTicket = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setSubmittedTicketId(generatedTicket);
      onSubmitSuccess(generatedTicket);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setSubmittedTicketId(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 id="issue-modal-title" className="text-sm font-bold text-slate-900">
                Delivery Resolution & Claim
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {submittedTicketId ? (
            /* Success confirmation */
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Claim Filed Successfully
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your incident ticket has been assigned to our senior resolution desk. We will prioritize your dispatch.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 inline-block mx-auto text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                  Incident Reference Code
                </span>
                <span className="font-mono font-bold text-indigo-600 text-sm">
                  #{submittedTicketId}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Guaranteed response within: <strong className="text-slate-700">2 hours</strong>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back to Tracking
              </button>
            </div>
          ) : (
            /* Form input */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-amber-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  We stand 100% behind your order. If your package cannot be located or has suffered excessive delays, we offer immediate replacement or refund.
                </p>
              </div>

              {/* Problem selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900 block">
                  What issue occurred?
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="issueType"
                      value="not_received"
                      checked={issueType === "not_received"}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="text-rose-600"
                    />
                    <span className="text-slate-800">
                      Tracking says delivered, but package is missing
                    </span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="issueType"
                      value="transit_delay"
                      checked={issueType === "transit_delay"}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="text-rose-600"
                    />
                    <span className="text-slate-800">
                      Package is severely delayed or stuck in transit
                    </span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="issueType"
                      value="wrong_address"
                      checked={issueType === "wrong_address"}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="text-rose-600"
                    />
                    <span className="text-slate-800">
                      Delivered to an incorrect address or building
                    </span>
                  </label>
                </div>
              </div>

              {/* Checked with neighbors checkbox */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-start gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedNeighbors}
                    onChange={(e) => setCheckedNeighbors(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600"
                  />
                  <span className="text-[11px] leading-snug">
                    I checked around porch, side entrances, and with neighbors/reception.
                  </span>
                </label>
              </div>

              {/* Preferred outcome */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900 block">
                  Preferred Resolution
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolutionPreference("replacement")}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-colors cursor-pointer ${
                      resolutionPreference === "replacement"
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Expedited Replacement
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolutionPreference("refund")}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-colors cursor-pointer ${
                      resolutionPreference === "refund"
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Full Refund (${order.pricing.total.toFixed(2)})
                  </button>
                </div>
              </div>

              {/* Details textarea */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-900 block">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Looked behind porch planters and asked doorman..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-indigo-600 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Claim to Logistics Team...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Resolution Claim</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
