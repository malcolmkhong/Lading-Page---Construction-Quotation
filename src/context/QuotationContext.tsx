import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClientData, LineItem, QuotationSettings } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface QuotationContextType {
  clientData: ClientData | null;
  lineItems: LineItem[];
  settings: QuotationSettings;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;

  setClientData: (data: ClientData) => void;
  addLineItem: (item: LineItem) => void;
  updateLineItem: (id: string, field: keyof LineItem, value: LineItem[keyof LineItem]) => void;
  removeLineItem: (id: string) => void;
  setTaxRate: (rate: number) => void;
  setDiscount: (rate: number) => void;
  resetQuotation: () => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  // State
  const [clientData, setClientDataState] = useState<ClientData | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [settings, setSettings] = useState<QuotationSettings>({ taxRate: 0, discount: 0 });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedClientData = localStorage.getItem('quotationClientData');
      const savedLineItems = localStorage.getItem('quotationLineItems');
      const savedTaxRate = localStorage.getItem('quotationTaxRate');
      const savedDiscount = localStorage.getItem('quotationDiscount');

      if (savedClientData) setClientDataState(JSON.parse(savedClientData));
      if (savedLineItems) setLineItems(JSON.parse(savedLineItems));

      setSettings({
        taxRate: savedTaxRate ? JSON.parse(savedTaxRate) : 0,
        discount: savedDiscount ? JSON.parse(savedDiscount) : 0
      });
    } catch (error) {
      console.error("Failed to load quotation data from local storage", error);
      toast({
        title: "Error loading data",
        description: "Could not restore your previous session.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Persist to LocalStorage whenever state changes
  useEffect(() => {
    if (clientData) localStorage.setItem('quotationClientData', JSON.stringify(clientData));
    else localStorage.removeItem('quotationClientData');
  }, [clientData]);

  useEffect(() => {
    localStorage.setItem('quotationLineItems', JSON.stringify(lineItems));
  }, [lineItems]);

  useEffect(() => {
    localStorage.setItem('quotationTaxRate', JSON.stringify(settings.taxRate));
    localStorage.setItem('quotationDiscount', JSON.stringify(settings.discount));
  }, [settings]);

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (settings.taxRate / 100);
  const discountAmount = subtotal * (settings.discount / 100);
  const total = subtotal + taxAmount - discountAmount;

  // Actions
  const setClientData = (data: ClientData) => {
    setClientDataState(data);
  };

  const addLineItem = (item: LineItem) => {
    setLineItems((prev) => [...prev, item]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: LineItem[keyof LineItem]) => {
    setLineItems((prev) => prev.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value } as LineItem;

        // Recalculate total if quantity or price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const setTaxRate = (rate: number) => {
    setSettings((prev) => ({ ...prev, taxRate: rate }));
  };

  const setDiscount = (rate: number) => {
    setSettings((prev) => ({ ...prev, discount: rate }));
  };

  const resetQuotation = () => {
    setClientDataState(null);
    setLineItems([]);
    setSettings({ taxRate: 0, discount: 0 });
    localStorage.removeItem('quotationClientData');
    localStorage.removeItem('quotationLineItems');
    localStorage.removeItem('quotationTaxRate');
    localStorage.removeItem('quotationDiscount');
  };

  return (
    <QuotationContext.Provider
      value={{
        clientData,
        lineItems,
        settings,
        subtotal,
        taxAmount,
        discountAmount,
        total,
        setClientData,
        addLineItem,
        updateLineItem,
        removeLineItem,
        setTaxRate,
        setDiscount,
        resetQuotation
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotation must be used within a QuotationProvider');
  }
  return context;
};
