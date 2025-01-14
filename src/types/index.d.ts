export type Product = {
  attributes: null | Record<string, unknown>; // Adjust if attributes have a more specific type
  collectionId: string;
  collectionName: string;
  created: string;
  description: string;
  id: string;
  in_stock: boolean;
  price: number;
  title: string;
  updated: string;
};

type QuoteItem = {
  price: number;
  product_name: string;
  quantity: number;
  subtotal: number;
};

type CustomerInfo = {
  address: string;
  city: string;
  country: string;
  email: string;
  name: string;
  phone: string;
};

export type QuoteFormDataType = {
  customer_info: CustomerInfo;
  description?: string;
  status: string;
  items: QuoteItem[];
  subtotal: number;
  total: number;
  total_tax: number;
  valid_until: string;
};

type Quote = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  customer_info: CustomerInfo;
  description: string;
  id: string;
  items: QuoteItem[];
  status: string;
  subtotal: number;
  total: number;
  total_tax: number;
  updated: string;
  valid_until: string;
};
