export interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  unit: string;
  unitPrice: number;
  description?: string;
}

export interface LineItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  materialId?: string;
  materialName?: string;
}

export interface ClientData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectName: string;
  projectAddress: string;
  projectDescription: string;
  validUntil: string;
  paymentTerms: string;
}

export interface QuotationSettings {
  taxRate: number;
  discount: number;
}
