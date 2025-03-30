
import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  getAllMaterials, 
  getMaterialsByCategory, 
  searchMaterials, 
  Material 
} from "@/utils/materialDatabase";
import { constructionCategories } from "@/utils/constructionCategories";

interface MaterialSelectorProps {
  onSelectMaterial: (material: Material) => void;
  selectedCategory?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonText?: string;
}

const MaterialSelector = ({ 
  onSelectMaterial, 
  selectedCategory, 
  buttonVariant = "outline",
  buttonText = "Select Material" 
}: MaterialSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategory || "");
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Initialize with all materials or category-filtered materials
    const initialMaterials = selectedCategory 
      ? getMaterialsByCategory(selectedCategory)
      : getAllMaterials();
      
    setMaterials(initialMaterials);
    setFilteredMaterials(initialMaterials);
  }, [selectedCategory]);
  
  useEffect(() => {
    // When category filter changes
    if (categoryFilter) {
      setFilteredMaterials(getMaterialsByCategory(categoryFilter));
    } else {
      setFilteredMaterials(getAllMaterials());
    }
  }, [categoryFilter]);
  
  useEffect(() => {
    // When search query changes
    if (searchQuery.trim() === "") {
      // If no search query, show category-filtered or all materials
      if (categoryFilter) {
        setFilteredMaterials(getMaterialsByCategory(categoryFilter));
      } else {
        setFilteredMaterials(getAllMaterials());
      }
    } else {
      // If there's a search query, search within current category filter
      const searchResults = searchMaterials(searchQuery);
      
      if (categoryFilter) {
        setFilteredMaterials(
          searchResults.filter(material => material.category === categoryFilter)
        );
      } else {
        setFilteredMaterials(searchResults);
      }
    }
  }, [searchQuery, categoryFilter]);
  
  const handleSelectMaterial = (material: Material) => {
    onSelectMaterial(material);
    setIsOpen(false);
    // Clear search after selection
    setSearchQuery("");
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Material Database</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {constructionCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No materials found. Try changing your search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <div className="font-medium">{material.name}</div>
                        <Badge variant="outline" className="mt-1">
                          {constructionCategories.find(c => c.value === material.category)?.label || material.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        {material.description || "No description available"}
                      </TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(material.unitPrice)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleSelectMaterial(material)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialSelector;
