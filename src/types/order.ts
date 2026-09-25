export type OrderStatusType =
  | "delayed"
  | "delivered_not_received"
  | "tracking_pending";

export type MilestoneState = "completed" | "current" | "upcoming";

export interface TrackingEvent {
  id: string;
  stage: "order_placed" | "processing" | "shipped" | "out_for_delivery" | "delivered";
  title: string;
  subtitle: string;
  timestamp: string;
  location?: string;
  state: MilestoneState;
  isDelayedIssue?: boolean;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

export interface DeliveryAddress {
  recipientName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  deliveryInstructions?: string;
}

export interface CarrierDetails {
  name: string;
  trackingNumber: string;
  serviceLevel: string;
  trackingUrl?: string;
  phone?: string;
}

export interface DeliveryProof {
  dropLocation: string;
  timestamp: string;
  signedBy?: string;
  photoUrl?: string;
  carrierNote?: string;
}

export interface OrderData {
  id: string;
  stateType: OrderStatusType;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount?: number;
    total: number;
  };
  paymentMethod: {
    brand: string;
    last4: string;
  };
  deliveryAddress: DeliveryAddress;
  carrier: CarrierDetails;
  
  // Status banner & context
  status: {
    badgeText: string;
    badgeVariant: "amber" | "rose" | "indigo" | "emerald";
    headline: string;
    explanation: string;
    contextPill?: string;
    lastChecked: string;
  };

  // Estimate
  estimate: {
    displayDate: string;
    displayTime?: string;
    isDelayed: boolean;
    originalDate?: string;
    originalTime?: string;
    delayReason?: string;
    updatedNote?: string;
    isPending?: boolean;
  };

  // Timeline
  timeline: TrackingEvent[];

  // State-specific attributes
  deliveryProof?: DeliveryProof;
  missingPackageTips?: string[];
  pendingTrackingMessage?: {
    estimatedAvailableTime: string;
    warehouseStatus: string;
  };
}
