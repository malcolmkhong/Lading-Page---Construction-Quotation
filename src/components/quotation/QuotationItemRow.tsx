import React from "react";
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
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Database, Edit, Trash2 } from "lucide-react";
import MaterialSelector from "@/components/MaterialSelector";
import { constructionCategories, constructionUnits } from "@/utils/constructionCategories";
import { Material, LineItem } from "@/types";

interface QuotationItemRowProps {
  item: LineItem;
  isEditing: boolean;
  onUpdate: (id: string, field: keyof LineItem, value: LineItem[keyof LineItem]) => void;
  onRemove: (id: string) => void;
  onStartEditing: (id: string) => void;
  onFinishEditing: () => void;
  onSelectMaterial: (id: string, material: Material) => void;
  isAnyEditing: boolean;
  formatCurrency: (amount: number) => string;
}

export const QuotationItemRow = ({
  item,
  isEditing,
  onUpdate,
  onRemove,
  onStartEditing,
  onFinishEditing,
  onSelectMaterial,
  isAnyEditing,
  formatCurrency
}: QuotationItemRowProps) => {

  return (
    <TableRow id={`item-${item.id}`}>
      <TableCell>
        <div className="space-y-2">
          {item.materialName && (
            <div className="bg-primary/10 text-primary text-xs font-medium p-1 rounded-sm mb-1">
              {item.materialName}
            </div>
          )}
          <Select
            value={item.category}
            onValueChange={(value) => onUpdate(item.id, 'category', value)}
            disabled={!isEditing && isAnyEditing}
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
              onValueChange={(value) => onUpdate(item.id, 'subcategory', value)}
              disabled={!isEditing && isAnyEditing}
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
            onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
            placeholder="Enter description"
            className="min-h-[80px] resize-y"
            disabled={!isEditing && isAnyEditing}
          />
          {isEditing && item.category && (
            <div className="mt-2">
              <MaterialSelector
                onSelectMaterial={(material) => onSelectMaterial(item.id, material)}
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
          onChange={(e) => onUpdate(item.id, 'quantity', Number(e.target.value))}
          min="1"
          className="w-[120px]"
          disabled={!isEditing && isAnyEditing}
        />
      </TableCell>
      <TableCell>
        <Select
          value={item.unit}
          onValueChange={(value) => onUpdate(item.id, 'unit', value)}
          disabled={!isEditing && isAnyEditing}
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
            onChange={(e) => onUpdate(item.id, 'unitPrice', Number(e.target.value))}
            min="0"
            step="0.01"
            className="w-[120px]"
            disabled={!isEditing && isAnyEditing}
          />
        </div>
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(item.total)}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          {isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onFinishEditing}
              className="text-green-500 hover:text-green-600 hover:bg-green-100"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStartEditing(item.id)}
              disabled={isAnyEditing}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isAnyEditing && !isEditing}
                className="text-primary"
              >
                <Database className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Quick Add Material</h4>
                <MaterialSelector
                  onSelectMaterial={(material) => onSelectMaterial(item.id, material)}
                  selectedCategory={item.category || undefined}
                  buttonText="Browse Materials"
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-100"
            disabled={isAnyEditing && !isEditing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
