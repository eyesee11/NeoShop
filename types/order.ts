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
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  paymentMethod: "credit_card" | "debit_card";
}
