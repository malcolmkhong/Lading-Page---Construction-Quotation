import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Send, Save, FileCheck, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { constructionCategories } from "@/utils/constructionCategories";
import { useQuotation } from "@/context/QuotationContext";

const QuotationExportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    clientData,
    lineItems,
    subtotal,
    taxAmount,
    discountAmount,
    total,
    settings,
    setClientData,
    resetQuotation
  } = useQuotation();

  const [quotationNumber, setQuotationNumber] = useState("");
  const [editingTerms, setEditingTerms] = useState(false);
  const [editingTAndC, setEditingTAndC] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState<string>("");
  
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setQuotationNumber(`Q${year}${month}-${random}`);
    
    if (!clientData) {
      toast({
        title: "No client data found",
        description: "Please complete the client information first",
        variant: "destructive"
      });
      navigate("/quotation/client");
      return;
    }
    
    if (lineItems.length === 0) {
      toast({
        title: "No line items found",
        description: "Please add items to your quotation first",
        variant: "destructive"
      });
      navigate("/quotation/items");
      return;
    }

    // Load saved T&C if available, otherwise use default
    const savedTAndC = localStorage.getItem('quotationTermsAndConditions');
    if (savedTAndC) {
      setTermsAndConditions(savedTAndC);
    } else {
      // Set default construction T&C
      setTermsAndConditions(
`1. VALIDITY: This quotation is valid for 30 days from the date of issue.

2. PAYMENT TERMS: 
   - 30% deposit upon acceptance of quotation
   - 40% upon completion of 50% of work
   - 30% upon completion of work and prior to handover

3. SCOPE OF WORK: Only works specified in this quotation are included. Any additional work will be charged separately.

4. MATERIALS: All materials supplied will be of good quality and as per specifications. Any changes must be agreed in writing.

5. TIMING: Completion dates are estimates only and subject to site conditions, weather, and material availability.

6. VARIATIONS: Any variations or additional works requested by the client will be subject to additional charges and may affect completion timeline.

7. DISPUTES: Any disputes arising shall be resolved through negotiation in good faith before any legal action.

8. WARRANTY: Workmanship is guaranteed for 6 months from completion date. Material warranties as per manufacturer terms.

9. SITE ACCESS: Client must provide reasonable access to site, water, and electricity for construction purposes.

10. PERMITS & APPROVALS: Client is responsible for obtaining necessary permits unless specifically included in this quotation.

11. SITE SAFETY: All reasonable safety precautions will be taken during construction. Site visitors must adhere to safety guidelines.

12. CLEAN-UP: Basic clean-up is included, but not detailed or professional cleaning services.`
      );
    }
  }, [clientData, lineItems, navigate, toast]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const handleSaveQuotation = () => {
    // Save terms and conditions to localStorage
    localStorage.setItem('quotationTermsAndConditions', termsAndConditions);
    
    toast({
      title: "Quotation saved",
      description: `Quotation ${quotationNumber} has been saved successfully`,
    });
  };
  
  const handleEmailToClient = () => {
    toast({
      title: "Email sent",
      description: `Quotation sent to ${clientData?.clientEmail}`,
    });
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "PDF generated",
      description: "Your quotation PDF is downloading",
    });
  };
  
  const handleNewQuotation = () => {
    resetQuotation();
    localStorage.removeItem('quotationTermsAndConditions');
    
    navigate("/quotation/client");
    
    toast({
      title: "New quotation",
      description: "Starting a new quotation",
    });
  };

  const handleSaveTerms = () => {
    setEditingTerms(false);
    toast({
      title: "Payment terms updated",
      description: "Payment terms have been updated successfully",
    });
  };

  const handleSaveTAndC = () => {
    setEditingTAndC(false);
    localStorage.setItem('quotationTermsAndConditions', termsAndConditions);
    toast({
      title: "Terms & Conditions updated",
      description: "Terms & Conditions have been updated successfully",
    });
  };

  if (!clientData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/quotation/items")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Line Items
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground opacity-50 flex items-center justify-center text-sm font-medium">1</div>
              <span className="ml-2 text-muted-foreground">Client Info</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground opacity-50 flex items-center justify-center text-sm font-medium">2</div>
              <span className="ml-2 text-muted-foreground">Line Items</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
              <span className="ml-2 font-medium">Export</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Quotation #{quotationNumber}</CardTitle>
                  <CardDescription>Review and export your quotation</CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-semibold">TOTAL</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(total)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {clientData && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium mb-2">Client Information</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <p><span className="font-medium">Name:</span> {clientData.clientName}</p>
                      <p><span className="font-medium">Email:</span> {clientData.clientEmail}</p>
                      {clientData.clientPhone && (
                        <p><span className="font-medium">Phone:</span> {clientData.clientPhone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Project Information</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <p><span className="font-medium">Project:</span> {clientData.projectName}</p>
                      <p><span className="font-medium">Address:</span> {clientData.projectAddress}</p>
                      <p className="text-sm text-muted-foreground">{clientData.projectDescription}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Quotation Details</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <p><span className="font-medium">Quotation Number:</span> {quotationNumber}</p>
                      <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                      <p><span className="font-medium">Valid Until:</span> {formatDate(clientData.validUntil)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Line Items</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.map((item) => {
                        const category = constructionCategories.find(cat => cat.value === item.category);
                        const subcategory = category?.subcategories.find(sub => sub.value === item.subcategory);
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="align-top">
                              <div>
                                <p className="font-medium">{category?.label}</p>
                                <p className="text-xs text-primary font-medium">
                                  {category?.description}
                                </p>
                                {item.subcategory && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {subcategory?.label}
                                  </p>
                                )}
                                {item.materialName && (
                                  <p className="text-xs bg-primary/10 text-primary p-1 rounded-sm mt-2">
                                    Material: {item.materialName}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 space-y-2 border-t pt-4 max-w-xs ml-auto">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax ({settings.taxRate}%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Discount ({settings.discount}%):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Terms Section */}
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-lg">Payment Terms</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingTerms(!editingTerms)}
                    className="h-8"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {editingTerms ? "Cancel" : "Edit"}
                  </Button>
                </div>
                
                {editingTerms ? (
                  <div className="space-y-3">
                    <Textarea 
                      value={clientData?.paymentTerms || ""}
                      onChange={(e) => {
                        if (clientData) {
                          setClientData({
                            ...clientData,
                            paymentTerms: e.target.value
                          });
                        }
                      }}
                      className="min-h-[100px]"
                    />
                    <Button 
                      onClick={handleSaveTerms}
                      size="sm"
                    >
                      Save Payment Terms
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                    {clientData?.paymentTerms || "No payment terms specified"}
                  </div>
                )}
              </div>
              
              {/* Terms and Conditions Section */}
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-lg">Terms & Conditions</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingTAndC(!editingTAndC)}
                    className="h-8"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {editingTAndC ? "Cancel" : "Edit"}
                  </Button>
                </div>
                
                {editingTAndC ? (
                  <div className="space-y-3">
                    <Textarea 
                      value={termsAndConditions}
                      onChange={(e) => setTermsAndConditions(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <Button 
                      onClick={handleSaveTAndC}
                      size="sm"
                    >
                      Save Terms & Conditions
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded-md whitespace-pre-line text-sm">
                    {termsAndConditions || "No terms and conditions specified"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleSaveQuotation} 
              className="flex-1 max-w-60"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Quotation
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 max-w-60"
              onClick={handleEmailToClient}
            >
              <Send className="mr-2 h-4 w-4" />
              Email to Client
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1 max-w-60"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              onClick={handleNewQuotation}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Create New Quotation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuotationExportPage;
