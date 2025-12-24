import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuotation } from "@/context/QuotationContext";
import { QuotationItemRow } from "@/components/quotation/QuotationItemRow";
import { QuotationSummary } from "@/components/quotation/QuotationSummary";
import { Material } from "@/types";

const QuotationItemsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    clientData,
    lineItems,
    addLineItem,
    updateLineItem,
    removeLineItem,
    subtotal,
    taxAmount,
    discountAmount,
    total,
    settings,
    setTaxRate,
    setDiscount
  } = useQuotation();

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);
  
  useEffect(() => {
    if (!clientData) {
      toast({
        title: "No client data found",
        description: "Please complete the client information first",
        variant: "destructive"
      });
      navigate("/quotation/client");
    }
  }, [clientData, navigate, toast]);
  
  const handleAddLineItem = () => {
    const newItem = {
      id: Date.now().toString(),
      category: "",
      subcategory: "",
      description: "",
      quantity: 1,
      unit: "sq.ft",
      unitPrice: 0,
      total: 0,
    };
    addLineItem(newItem);
    // Set to editing mode for the new item
    setEditingItemId(newItem.id);
    // Keep track of last added item for auto-scrolling
    setLastAddedItem(newItem.id);
  };

  const handleSelectMaterial = (itemId: string, material: Material) => {
    // We need to update multiple fields
    // Since our updateLineItem only takes one field, we can do this sequentially or improve the context API
    // Improving the context API is better, but for now let's just do sequential updates
    // OR: Since we are in the component, we can just call updateLineItem for each field.
    // Actually, passing multiple updates might trigger multiple re-renders.
    // Ideally updateLineItem should accept a partial object.
    // But let's stick to the interface for now.
    
    // Wait, I can just update the item in one go if I had a batch update function.
    // Let's assume the context handles re-renders efficiently enough.
    
    // A better way: Let's create a helper in the component to batch this or just call it multiple times.
    // Actually, I'll update the context to allow partial updates in a later step if needed,
    // but for now I will just call updateLineItem for each field that matters.

    // Actually, looking at the previous implementation, it did:
    // const updatedItem = { ...item, ...materialFields };
    // setLineItems(...);

    // I should probably add `updateLineItemBatch` to context or just use `updateLineItem` for the critical parts
    // and rely on the fact that React batches state updates in event handlers.

    // Let's try to update all fields.
    updateLineItem(itemId, 'category', material.category);
    updateLineItem(itemId, 'subcategory', material.subcategory);
    updateLineItem(itemId, 'unit', material.unit);
    updateLineItem(itemId, 'unitPrice', material.unitPrice);
    updateLineItem(itemId, 'description', material.description || "");
    updateLineItem(itemId, 'materialId', material.id);
    updateLineItem(itemId, 'materialName', material.name);
    // Quantity stays the same, total updates automatically in context because of unitPrice change.

    toast({
      title: "Material added",
      description: `Added ${material.name} to your quotation`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleContinue = () => {
    if (lineItems.length === 0) {
      toast({
        title: "No line items",
        description: "Please add at least one item to the quotation",
        variant: "destructive"
      });
      return;
    }
    navigate("/quotation/export");
  };

  // Use effect to scroll to newly added item
  useEffect(() => {
    if (lastAddedItem) {
      const element = document.getElementById(`item-${lastAddedItem}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Reset after scrolling
      setLastAddedItem(null);
    }
  }, [lastAddedItem]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/quotation/client")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client Info
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground opacity-50 flex items-center justify-center text-sm font-medium">1</div>
              <span className="ml-2 text-muted-foreground">Client Info</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
              <span className="ml-2 font-medium">Line Items</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
              <span className="ml-2 text-muted-foreground">Export</span>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {clientData && (
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Project: {clientData.projectName}</h3>
                  <p className="text-sm text-muted-foreground">Client: {clientData.clientName}</p>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category/Subcategory</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[120px]">Qty</TableHead>
                      <TableHead className="w-[120px]">Unit</TableHead>
                      <TableHead className="w-[150px]">Price</TableHead>
                      <TableHead className="text-right w-[120px]">Total</TableHead>
                      <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <QuotationItemRow
                        key={item.id}
                        item={item}
                        isEditing={editingItemId === item.id}
                        onUpdate={updateLineItem}
                        onRemove={removeLineItem}
                        onStartEditing={setEditingItemId}
                        onFinishEditing={() => setEditingItemId(null)}
                        onSelectMaterial={handleSelectMaterial}
                        isAnyEditing={editingItemId !== null}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                    {lineItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No items added yet. Click "Add Item" to begin.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleAddLineItem}
                className="w-full"
                disabled={editingItemId !== null}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              
              <QuotationSummary
                subtotal={subtotal}
                taxRate={settings.taxRate}
                setTaxRate={setTaxRate}
                taxAmount={taxAmount}
                discount={settings.discount}
                setDiscount={setDiscount}
                discountAmount={discountAmount}
                total={total}
                formatCurrency={formatCurrency}
              />
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleContinue} disabled={editingItemId !== null}>
                  Continue to Export
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuotationItemsPage;
