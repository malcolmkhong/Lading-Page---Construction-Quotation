
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight, User, Mail, Phone, Building, MapPin, FileText, Calendar, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

// Define the schema for the form
const formSchema = z.object({
  clientName: z.string().min(2, { message: "Client name is required" }),
  clientEmail: z.string().email({ message: "Valid email is required" }),
  clientPhone: z.string().optional(),
  projectName: z.string().min(2, { message: "Project name is required" }),
  projectAddress: z.string().min(2, { message: "Project address is required" }),
  projectDescription: z.string().min(10, { message: "Please provide more details about the project" }),
  validUntil: z.string(),
  paymentTerms: z.string(),
});

export type ClientFormData = z.infer<typeof formSchema>;

const QuotationClientPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      projectName: "",
      projectAddress: "",
      projectDescription: "",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // 30 days from now
      paymentTerms: "50% upfront, 50% on completion",
    },
  });

  const onSubmit = (data: ClientFormData) => {
    // Save client data to localStorage
    localStorage.setItem('quotationClientData', JSON.stringify(data));
    
    // Navigate to the next step
    navigate("/quotation/items");
    
    toast({
      title: "Client information saved",
      description: "Moving to line items",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shadow-sm">1</div>
              <span className="ml-2 font-medium">Client Info</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">2</div>
              <span className="ml-2 text-muted-foreground">Line Items</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
              <span className="ml-2 text-muted-foreground">Export</span>
            </div>
          </div>
        </div>
        
        <Card className="max-w-3xl mx-auto shadow-md border-opacity-50">
          <CardHeader className="bg-muted/30 border-b pb-8">
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Client & Project Information
            </CardTitle>
            <CardDescription>
              Enter the client and project details for your quotation
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Client Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Enter client name" 
                                className="pl-8" 
                                {...field} 
                              />
                              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="email" 
                                placeholder="client@example.com" 
                                className="pl-8" 
                                {...field} 
                              />
                              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Phone number" 
                              className="pl-8" 
                              {...field} 
                            />
                            <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Project Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Enter project name" 
                                className="pl-8" 
                                {...field} 
                              />
                              <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="projectAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Project location" 
                                className="pl-8" 
                                {...field} 
                              />
                              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the construction project and scope of work" 
                            className="h-24 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Quotation Terms</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid Until</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="date" 
                                className="pl-8" 
                                {...field} 
                              />
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Terms</FormLabel>
                          <div className="relative">
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <div className="relative">
                                  <SelectTrigger className="pl-8">
                                    <SelectValue placeholder="Select payment terms" />
                                  </SelectTrigger>
                                  <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="On completion">On completion</SelectItem>
                                <SelectItem value="50% upfront, 50% on completion">50% upfront, 50% on completion</SelectItem>
                                <SelectItem value="30% upfront, 30% midway, 40% on completion">30% upfront, 30% midway, 40% on completion</SelectItem>
                                <SelectItem value="Progress payment">Progress payment</SelectItem>
                                <SelectItem value="14 days after invoice date">14 days after invoice date</SelectItem>
                                <SelectItem value="30 days after invoice date">30 days after invoice date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <CardFooter className="flex justify-end px-0 pt-4">
                  <Button 
                    type="submit"
                    className="gap-2 transition-all hover:gap-3"
                  >
                    Continue to Line Items 
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuotationClientPage;
