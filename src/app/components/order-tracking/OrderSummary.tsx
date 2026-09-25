"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OrderData } from "@/types/order";
import {
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  Receipt,
  Copy,
  Check,
  FileText,
} from "lucide-react";

interface OrderSummaryProps {
  order: OrderData;
  onCopyOrderId: () => void;
  hasCopiedOrderId: boolean;
}

export default function OrderSummary({
  order,
  onCopyOrderId,
  hasCopiedOrderId,
}: OrderSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4" aria-label="Order and Product Summary">
      {/* Header with Order ID & toggle */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Order Reference
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-bold text-slate-900 font-mono">
              #{order.orderNumber}
            </span>
            <button
              type="button"
              onClick={onCopyOrderId}
              aria-label="Copy Order Number"
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100 cursor-pointer"
              title="Copy Order ID"
            >
              {hasCopiedOrderId ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Hide Details" : "View Details"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary Item Preview (Always Visible Compact Row) */}
      <div className="space-y-3">
        {order.items.slice(0, isExpanded ? order.items.length : 1).map((item) => (
          <div key={item.id} className="flex items-center gap-3.5 py-1">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
              {!imageError[item.id] ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={() => setImageError((prev) => ({ ...prev, [item.id]: true }))}
                />
              ) : (
                <Package className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {item.variant}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-slate-500 font-medium">Qty: {item.quantity}</span>
                <span className="font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {!isExpanded && order.items.length > 1 && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-1 cursor-pointer"
          >
            + {order.items.length - 1} more item in this shipment
          </button>
        )}
      </div>

      {/* Expanded Order Breakdown, Shipping Address & Payment Receipt */}
      {isExpanded && (
        <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
          {/* Shipping Address */}
          <div className="rounded-xl bg-slate-50 p-3.5 space-y-1.5 border border-slate-100">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Shipping Destination</span>
            </div>
            <div className="text-slate-600 leading-relaxed pl-5">
              <p className="font-medium text-slate-900">{order.deliveryAddress.recipientName}</p>
              <p>{order.deliveryAddress.street}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                {order.deliveryAddress.postalCode}, {order.deliveryAddress.country}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Contact: {order.deliveryAddress.phone}
              </p>
              {order.deliveryAddress.deliveryInstructions && (
                <p className="text-[11px] text-amber-800 bg-amber-50/80 p-1.5 rounded mt-2 border border-amber-200/50">
                  <span className="font-semibold">Note for courier:</span> {order.deliveryAddress.deliveryInstructions}
                </p>
              )}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-medium text-slate-900">${order.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Standard Shipping</span>
              <span className="font-medium text-slate-900">
                {order.pricing.shipping === 0 ? "FREE" : `$${order.pricing.shipping.toFixed(2)}`}
              </span>
            </div>
            {order.pricing.discount && order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Promotional Discount</span>
                <span className="font-medium">-${order.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax</span>
              <span className="font-medium text-slate-900">${order.pricing.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Paid</span>
              <span className="text-indigo-600">${order.pricing.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method & Invoice Action */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Paid via {order.paymentMethod.brand} (•••• {order.paymentMethod.last4})</span>
            </div>
            <button
              type="button"
              onClick={() => alert(`Receipt downloaded for Order #${order.orderNumber}`)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
