
// Material database with pricing information

export interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  unit: string;
  unitPrice: number;
  description?: string;
}

// Sample material database
const materialDatabase: Material[] = [
  // Concrete Works
  { id: "m001", name: "Grade 20 Concrete", category: "concrete", subcategory: "readyMix", unit: "m³", unitPrice: 280.00, description: "Ready-mixed concrete for general applications" },
  { id: "m002", name: "Grade 30 Concrete", category: "concrete", subcategory: "readyMix", unit: "m³", unitPrice: 320.00, description: "Higher strength concrete for structural elements" },
  { id: "m003", name: "Grade 35 Concrete", category: "concrete", subcategory: "readyMix", unit: "m³", unitPrice: 350.00, description: "High strength concrete for critical structural elements" },
  { id: "m004", name: "Steel Reinforcement (10mm)", category: "concrete", subcategory: "reinforcement", unit: "ton", unitPrice: 3500.00, description: "10mm diameter steel bars for concrete reinforcement" },
  { id: "m005", name: "Steel Reinforcement (12mm)", category: "concrete", subcategory: "reinforcement", unit: "ton", unitPrice: 3400.00, description: "12mm diameter steel bars for concrete reinforcement" },
  { id: "m006", name: "Steel Reinforcement (16mm)", category: "concrete", subcategory: "reinforcement", unit: "ton", unitPrice: 3300.00, description: "16mm diameter steel bars for concrete reinforcement" },
  
  // Brickwork
  { id: "m007", name: "Clay Bricks", category: "masonry", subcategory: "bricks", unit: "pcs", unitPrice: 0.85, description: "Standard clay bricks for walls and partitions" },
  { id: "m008", name: "Cement Blocks (4\")", category: "masonry", subcategory: "blocks", unit: "pcs", unitPrice: 2.50, description: "4-inch cement blocks for non-load bearing walls" },
  { id: "m009", name: "Cement Blocks (6\")", category: "masonry", subcategory: "blocks", unit: "pcs", unitPrice: 3.80, description: "6-inch cement blocks for load bearing walls" },
  
  // Flooring
  { id: "m010", name: "Ceramic Tiles (Basic)", category: "flooring", subcategory: "ceramic", unit: "m²", unitPrice: 25.00, description: "Basic ceramic tiles for standard applications" },
  { id: "m011", name: "Ceramic Tiles (Premium)", category: "flooring", subcategory: "ceramic", unit: "m²", unitPrice: 45.00, description: "Premium grade ceramic tiles with enhanced durability" },
  { id: "m012", name: "Porcelain Tiles", category: "flooring", subcategory: "porcelain", unit: "m²", unitPrice: 65.00, description: "High quality porcelain tiles for premium flooring" },
  { id: "m013", name: "Vinyl Flooring", category: "flooring", subcategory: "vinyl", unit: "m²", unitPrice: 35.00, description: "Durable vinyl flooring for high traffic areas" },
  { id: "m014", name: "Hardwood Flooring", category: "flooring", subcategory: "wood", unit: "m²", unitPrice: 120.00, description: "Premium hardwood flooring for luxury spaces" },
  
  // Painting
  { id: "m015", name: "Interior Paint (Basic)", category: "painting", subcategory: "interior", unit: "liter", unitPrice: 18.00, description: "Standard interior wall paint" },
  { id: "m016", name: "Interior Paint (Premium)", category: "painting", subcategory: "interior", unit: "liter", unitPrice: 35.00, description: "Premium interior paint with enhanced durability" },
  { id: "m017", name: "Exterior Paint (Basic)", category: "painting", subcategory: "exterior", unit: "liter", unitPrice: 25.00, description: "Standard weather-resistant exterior paint" },
  { id: "m018", name: "Exterior Paint (Premium)", category: "painting", subcategory: "exterior", unit: "liter", unitPrice: 45.00, description: "Premium exterior paint with enhanced weather resistance" },
  { id: "m019", name: "Primer", category: "painting", subcategory: "primers", unit: "liter", unitPrice: 15.00, description: "Surface preparation primer for painting applications" },
  
  // Plumbing
  { id: "m020", name: "PVC Pipes (1/2\")", category: "plumbing", subcategory: "pipes", unit: "m", unitPrice: 3.50, description: "Half-inch PVC pipes for water supply" },
  { id: "m021", name: "PVC Pipes (3/4\")", category: "plumbing", subcategory: "pipes", unit: "m", unitPrice: 5.20, description: "Three-quarter-inch PVC pipes for water supply" },
  { id: "m022", name: "PVC Pipes (1\")", category: "plumbing", subcategory: "pipes", unit: "m", unitPrice: 7.80, description: "One-inch PVC pipes for water supply" },
  { id: "m023", name: "Basic Sink", category: "plumbing", subcategory: "fixtures", unit: "pcs", unitPrice: 120.00, description: "Standard stainless steel kitchen sink" },
  { id: "m024", name: "Premium Sink", category: "plumbing", subcategory: "fixtures", unit: "pcs", unitPrice: 350.00, description: "Premium stainless steel kitchen sink with accessories" },
  { id: "m025", name: "Basic Toilet Set", category: "plumbing", subcategory: "fixtures", unit: "set", unitPrice: 280.00, description: "Standard toilet bowl and tank set" },
  { id: "m026", name: "Premium Toilet Set", category: "plumbing", subcategory: "fixtures", unit: "set", unitPrice: 650.00, description: "Premium toilet set with water-saving features" },
  
  // Electrical
  { id: "m027", name: "Electrical Cables (1.5mm²)", category: "electrical", subcategory: "wiring", unit: "m", unitPrice: 2.80, description: "1.5mm² electrical cables for lighting circuits" },
  { id: "m028", name: "Electrical Cables (2.5mm²)", category: "electrical", subcategory: "wiring", unit: "m", unitPrice: 4.50, description: "2.5mm² electrical cables for power outlets" },
  { id: "m029", name: "Electrical Cables (4.0mm²)", category: "electrical", subcategory: "wiring", unit: "m", unitPrice: 7.20, description: "4.0mm² electrical cables for heavy appliances" },
  { id: "m030", name: "Standard Switch", category: "electrical", subcategory: "accessories", unit: "pcs", unitPrice: 8.50, description: "Basic wall switch for lighting control" },
  { id: "m031", name: "Premium Switch", category: "electrical", subcategory: "accessories", unit: "pcs", unitPrice: 25.00, description: "Premium wall switch with modern design" },
  { id: "m032", name: "Standard Socket Outlet", category: "electrical", subcategory: "accessories", unit: "pcs", unitPrice: 12.00, description: "Basic electrical socket for general use" },
  { id: "m033", name: "Premium Socket Outlet", category: "electrical", subcategory: "accessories", unit: "pcs", unitPrice: 35.00, description: "Premium electrical socket with USB charging ports" },
  
  // Roofing
  { id: "m034", name: "Concrete Roof Tiles", category: "roofing", subcategory: "tiles", unit: "m²", unitPrice: 45.00, description: "Durable concrete roof tiles for residential buildings" },
  { id: "m035", name: "Clay Roof Tiles", category: "roofing", subcategory: "tiles", unit: "m²", unitPrice: 65.00, description: "Traditional clay roof tiles with excellent aesthetics" },
  { id: "m036", name: "Metal Roofing Sheets", category: "roofing", subcategory: "metal", unit: "m²", unitPrice: 38.00, description: "Lightweight metal sheets for quick installation" },
  { id: "m037", name: "Waterproofing Membrane", category: "roofing", subcategory: "waterproofing", unit: "m²", unitPrice: 25.00, description: "Waterproofing membrane for flat roofs" },
  
  // Carpentry
  { id: "m038", name: "Wooden Door (Interior)", category: "carpentry", subcategory: "doors", unit: "pcs", unitPrice: 280.00, description: "Standard wooden interior door" },
  { id: "m039", name: "Wooden Door (Exterior)", category: "carpentry", subcategory: "doors", unit: "pcs", unitPrice: 450.00, description: "Heavy-duty wooden exterior door" },
  { id: "m040", name: "Wooden Window Frame", category: "carpentry", subcategory: "windows", unit: "pcs", unitPrice: 180.00, description: "Wooden window frame for standard openings" },
  { id: "m041", name: "Kitchen Cabinet (Basic)", category: "carpentry", subcategory: "cabinets", unit: "m", unitPrice: 350.00, description: "Basic kitchen cabinets with standard finishes" },
  { id: "m042", name: "Kitchen Cabinet (Premium)", category: "carpentry", subcategory: "cabinets", unit: "m", unitPrice: 750.00, description: "Premium kitchen cabinets with high-end finishes" },
  
  // HVAC
  { id: "m043", name: "Split AC Unit (1.0HP)", category: "hvac", subcategory: "ac", unit: "set", unitPrice: 1200.00, description: "1.0 horsepower split air conditioning unit" },
  { id: "m044", name: "Split AC Unit (1.5HP)", category: "hvac", subcategory: "ac", unit: "set", unitPrice: 1600.00, description: "1.5 horsepower split air conditioning unit" },
  { id: "m045", name: "Split AC Unit (2.0HP)", category: "hvac", subcategory: "ac", unit: "set", unitPrice: 2200.00, description: "2.0 horsepower split air conditioning unit" },
  { id: "m046", name: "Ceiling Fan", category: "hvac", subcategory: "fans", unit: "pcs", unitPrice: 150.00, description: "Standard ceiling fan with variable speed" },
  
  // Landscaping
  { id: "m047", name: "Garden Soil", category: "landscaping", subcategory: "soil", unit: "m³", unitPrice: 85.00, description: "Quality topsoil for garden areas" },
  { id: "m048", name: "Decorative Gravel", category: "landscaping", subcategory: "decorative", unit: "m³", unitPrice: 120.00, description: "Decorative gravel for garden pathways" },
  { id: "m049", name: "Grass Turf", category: "landscaping", subcategory: "plants", unit: "m²", unitPrice: 18.00, description: "Natural grass turf for lawn areas" },
  { id: "m050", name: "Outdoor Pavers", category: "landscaping", subcategory: "pavers", unit: "m²", unitPrice: 55.00, description: "Concrete pavers for outdoor patios and walkways" },
];

// Function to get all materials
export const getAllMaterials = (): Material[] => {
  return materialDatabase;
};

// Function to filter materials by category
export const getMaterialsByCategory = (category: string): Material[] => {
  return materialDatabase.filter(material => material.category === category);
};

// Function to filter materials by subcategory
export const getMaterialsBySubcategory = (subcategory: string): Material[] => {
  return materialDatabase.filter(material => material.subcategory === subcategory);
};

// Function to get a material by ID
export const getMaterialById = (id: string): Material | undefined => {
  return materialDatabase.find(material => material.id === id);
};

// Function to search materials by name
export const searchMaterials = (query: string): Material[] => {
  const lowercaseQuery = query.toLowerCase();
  return materialDatabase.filter(material => 
    material.name.toLowerCase().includes(lowercaseQuery) ||
    material.description?.toLowerCase().includes(lowercaseQuery)
  );
};
