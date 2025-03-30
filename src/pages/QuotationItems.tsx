import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, PlusCircle, Trash2, Edit, CheckCircle, Database, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import MaterialSelector from "@/components/MaterialSelector";
import { constructionCategories, constructionUnits } from "@/utils/constructionCategories";
import { Material } from "@/utils/materialDatabase";
import { useToast } from "@/hooks/use-toast";
import { ClientFormData } from "./QuotationClient";

interface LineItem {
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

const QuotationItemsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [clientData, setClientData] = useState<ClientFormData | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);
  
  useEffect(() => {
    const savedClientData = localStorage.getItem('quotationClientData');
    if (!savedClientData) {
      toast({
        title: "No client data found",
        description: "Please complete the client information first",
        variant: "destructive"
      });
      navigate("/quotation/client");
      return;
    }
    
    setClientData(JSON.parse(savedClientData));
    
    const savedLineItems = localStorage.getItem('quotationLineItems');
    if (savedLineItems) {
      setLineItems(JSON.parse(savedLineItems));
    }
    
    const savedTaxRate = localStorage.getItem('quotationTaxRate');
    const savedDiscount = localStorage.getItem('quotationDiscount');
    
    if (savedTaxRate) setTaxRate(JSON.parse(savedTaxRate));
    if (savedDiscount) setDiscount(JSON.parse(savedDiscount));
  }, [navigate, toast]);
  
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      category: "",
      subcategory: "",
      description: "",
      quantity: 1,
      unit: "sq.ft",
      unitPrice: 0,
      total: 0,
    };
    const updatedItems = [...lineItems, newItem];
    setLineItems(updatedItems);
    localStorage.setItem('quotationLineItems', JSON.stringify(updatedItems));
    // Set to editing mode for the new item
    setEditingItemId(newItem.id);
    // Keep track of last added item for auto-scrolling
    setLastAddedItem(newItem.id);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'category') {
          updatedItem.subcategory = "";
          setSelectedCategory(value);
        }
        
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setLineItems(updatedItems);
    localStorage.setItem('quotationLineItems', JSON.stringify(updatedItems));
    calculateSubtotal(updatedItems);
  };

  const removeLineItem = (id: string) => {
    const filteredItems = lineItems.filter(item => item.id !== id);
    setLineItems(filteredItems);
    localStorage.setItem('quotationLineItems', JSON.stringify(filteredItems));
    calculateSubtotal(filteredItems);
    
    // If removing the item being edited, clear the editing state
    if (editingItemId === id) {
      setEditingItemId(null);
    }
  };

  const calculateSubtotal = (items: LineItem[]) => {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(total);
  };

  const calculateTax = () => {
    return subtotal * (taxRate / 100);
  };

  const calculateDiscount = () => {
    return subtotal * (discount / 100);
  };

  const calculateTotal = () => {
    return subtotal + calculateTax() - calculateDiscount();
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
    
    localStorage.setItem('quotationTaxRate', JSON.stringify(taxRate));
    localStorage.setItem('quotationDiscount', JSON.stringify(discount));
    
    navigate("/quotation/export");
  };
  
  const startEditing = (itemId: string) => {
    setEditingItemId(itemId);
  };
  
  const finishEditing = () => {
    setEditingItemId(null);
  };
  
  const handleSelectMaterial = (itemId: string, material: Material) => {
    const updatedItems = lineItems.map(item => {
      if (item.id === itemId) {
        const category = material.category || item.category;
        const subcategory = material.subcategory || item.subcategory;
        
        return {
          ...item,
          category,
          subcategory,
          unit: material.unit,
          unitPrice: material.unitPrice,
          total: item.quantity * material.unitPrice,
          description: item.description || material.description || "",
          materialId: material.id,
          materialName: material.name
        };
      }
      return item;
    });
    
    setLineItems(updatedItems);
    localStorage.setItem('quotationLineItems', JSON.stringify(updatedItems));
    calculateSubtotal(updatedItems);
    
    toast({
      title: "Material added",
      description: `Added ${material.name} to your quotation`,
    });
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
                      <TableRow key={item.id} id={`item-${item.id}`}>
                        <TableCell>
                          <div className="space-y-2">
                            {item.materialName && (
                              <div className="bg-primary/10 text-primary text-xs font-medium p-1 rounded-sm mb-1">
                                {item.materialName}
                              </div>
                            )}
                            <Select
                              value={item.category}
                              onValueChange={(value) => updateLineItem(item.id, 'category', value)}
                              disabled={editingItemId !== item.id && editingItemId !== null}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {constructionCategories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {item.category && (
                              <Select
                                value={item.subcategory}
                                onValueChange={(value) => updateLineItem(item.id, 'subcategory', value)}
                                disabled={editingItemId !== item.id && editingItemId !== null}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  {constructionCategories
                                    .find(cat => cat.value === item.category)
                                    ?.subcategories.map((subcat) => (
                                      <SelectItem key={subcat.value} value={subcat.value}>
                                        {subcat.label}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Textarea 
                              value={item.description} 
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                              placeholder="Enter description"
                              className="min-h-[80px] resize-y"
                              disabled={editingItemId !== item.id && editingItemId !== null}
                            />
                            {editingItemId === item.id && item.category && (
                              <div className="mt-2">
                                <MaterialSelector 
                                  onSelectMaterial={(material) => handleSelectMaterial(item.id, material)}
                                  selectedCategory={item.category}
                                  buttonVariant="outline"
                                  buttonText="Select from Material Database"
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                            min="1"
                            className="w-[120px]"
                            disabled={editingItemId !== item.id && editingItemId !== null}
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.unit}
                            onValueChange={(value) => updateLineItem(item.id, 'unit', value)}
                            disabled={editingItemId !== item.id && editingItemId !== null}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {constructionUnits.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-1">RM</span>
                            <Input 
                              type="number" 
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                              min="0"
                              step="0.01"
                              className="w-[120px]"
                              disabled={editingItemId !== item.id && editingItemId !== null}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {editingItemId === item.id ? (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={finishEditing}
                                className="text-green-500 hover:text-green-600 hover:bg-green-100"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => startEditing(item.id)}
                                disabled={editingItemId !== null}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  disabled={editingItemId !== null && editingItemId !== item.id}
                                  className="text-primary"
                                >
                                  <Database className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <h4 className="font-medium">Quick Add Material</h4>
                                  <MaterialSelector 
                                    onSelectMaterial={(material) => handleSelectMaterial(item.id, material)}
                                    selectedCategory={item.category || undefined}
                                    buttonText="Browse Materials"
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeLineItem(item.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-100"
                              disabled={editingItemId !== null && editingItemId !== item.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
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
                onClick={addLineItem}
                className="w-full"
                disabled={editingItemId !== null}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              
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
                  <span>{formatCurrency(calculateTax())}</span>
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
                  <span>-{formatCurrency(calculateDiscount())}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
              
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
