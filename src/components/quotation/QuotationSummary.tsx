import React from "react";
import { Input } from "@/components/ui/input";

interface QuotationSummaryProps {
  subtotal: number;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  taxAmount: number;
  discount: number;
  setDiscount: (rate: number) => void;
  discountAmount: number;
  total: number;
  formatCurrency: (amount: number) => string;
}

export const QuotationSummary = ({
  subtotal,
  taxRate,
  setTaxRate,
  taxAmount,
  discount,
  setDiscount,
  discountAmount,
  total,
  formatCurrency
}: QuotationSummaryProps) => {
  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span>Tax Rate (%):</span>
        <Input
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(Number(e.target.value))}
          className="w-32"
          min="0"
          max="100"
        />
      </div>

      <div className="flex justify-between">
        <span>Tax Amount:</span>
        <span>{formatCurrency(taxAmount)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span>Discount (%):</span>
        <Input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-32"
          min="0"
          max="100"
        />
      </div>

      <div className="flex justify-between">
        <span>Discount Amount:</span>
        <span>-{formatCurrency(discountAmount)}</span>
      </div>

      <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};
