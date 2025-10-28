export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id?: string; // MongoDB ID
  id?: string; // Alternative ID field
  userId: string;
  items: CartItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  totalAmount: number; // Total amount from API
  shippingAddress: ShippingAddress;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string | Date;
  paymentMethod?: "credit_card" | "debit_card";
}
