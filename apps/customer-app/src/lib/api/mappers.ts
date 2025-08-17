import { BackendProduct, BackendCategory } from './services';
import { Product, Category, ProductVariant } from '../types';

// Transform backend product to frontend product
export const mapBackendProductToFrontend = (backendProduct: BackendProduct): Product => {
  // Transform categories - use the first category as primary
  const primaryCategory = backendProduct.categories?.[0];
  const category: Category = primaryCategory ? {
    id: primaryCategory.id,
    name: primaryCategory.name,
    slug: primaryCategory.slug,
    description: primaryCategory.details || '',
    image: primaryCategory.image || primaryCategory.icon || '🛒',
    parentCategory: undefined,
    subcategories: [],
  } : {
    id: 'general',
    name: 'General',
    slug: 'general',
    description: 'General products',
    image: '🛒',
    parentCategory: undefined,
    subcategories: [],
  };

  // Create a default variant from the product
  const defaultVariant: ProductVariant = {
    id: `${backendProduct.id}-default`,
    name: 'Standard',
    price: backendProduct.sale_price || backendProduct.price,
    sku: backendProduct.sku,
    inStock: backendProduct.in_stock && backendProduct.quantity > 0,
    attributes: {
      weight: backendProduct.weight?.toString() || '',
      ...(backendProduct.attributes?.reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>) || {}),
    },
  };

  // Extract brand from attributes or use store name
  const brand = backendProduct.attributes?.find(attr => 
    attr.name.toLowerCase() === 'brand' || attr.name.toLowerCase() === 'manufacturer'
  )?.value || 'Fresh Grocery Market';

  // Generate a mock rating (in production, this would come from reviews)
  const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0-5.0 rating
  const reviewCount = Math.floor(Math.random() * 200) + 10; // 10-210 reviews

  return {
    id: backendProduct.id,
    name: backendProduct.name,
    description: backendProduct.description,
    price: backendProduct.price,
    category,
    images: backendProduct.images.length > 0 ? backendProduct.images : ['🛒'],
    variants: [defaultVariant],
    nutritionalInfo: {
      // Mock nutritional info - in production, this would be stored in the backend
      calories: undefined,
      protein: undefined,
      carbs: undefined,
      fat: undefined,
      fiber: undefined,
      sugar: undefined,
      sodium: undefined,
      servingSize: undefined,
      allergens: [],
      ingredients: [],
    },
    inStock: backendProduct.in_stock && backendProduct.quantity > 0,
    freshness: {
      // Mock freshness info - in production, this would be stored in the backend
      quality: backendProduct.quantity > 10 ? 'excellent' : 
               backendProduct.quantity > 5 ? 'good' : 'fair',
      freshnessDays: Math.floor(Math.random() * 14) + 1, // 1-14 days
    },
    slug: backendProduct.slug,
    sku: backendProduct.sku,
    weight: backendProduct.weight,
    unit: backendProduct.attributes?.find(attr => 
      attr.name.toLowerCase() === 'unit'
    )?.value || 'each',
    brand,
    rating,
    reviewCount,
  };
};

// Transform backend category to frontend category
export const mapBackendCategoryToFrontend = (backendCategory: BackendCategory): Category => {
  return {
    id: backendCategory.id,
    name: backendCategory.name,
    slug: backendCategory.slug,
    description: backendCategory.details || '',
    image: backendCategory.image || getCategoryEmoji(backendCategory.name),
    icon: backendCategory.icon,
    parentCategory: undefined, // Would need to be populated if needed
    subcategories: backendCategory.children?.map(mapBackendCategoryToFrontend) || [],
  };
};

// Transform backend products array to frontend products array
export const mapBackendProductsToFrontend = (backendProducts: BackendProduct[]): Product[] => {
  return backendProducts.map(mapBackendProductToFrontend);
};

// Transform backend categories array to frontend categories array
export const mapBackendCategoriesToFrontend = (backendCategories: BackendCategory[]): Category[] => {
  // If categories are store-specific, they should all be valid grocery categories
  // But still filter to be safe
  const groceryCategories = backendCategories.filter(category => 
    category.name && (isGroceryCategory(category.name) || category.storeId)
  );
  
  return groceryCategories.map(mapBackendCategoryToFrontend);
};

// Helper function to determine if a category is grocery-relevant
const isGroceryCategory = (categoryName: string): boolean => {
  const groceryKeywords = [
    // Our seeded categories
    'fresh', 'produce', 'dairy', 'eggs', 'meat', 'seafood', 'bakery', 'pantry', 'staples',
    'beverages', 'snacks', 'confectionery', 'frozen', 'foods', 'health', 'personal', 'care',
    'household', 'items',
    // General grocery terms
    'fruit', 'vegetable', 'bread', 'milk', 'cheese', 'yogurt', 'butter', 'cream',
    'fish', 'chicken', 'beef', 'pork', 'lamb', 'turkey', 'coffee', 'tea', 'juice',
    'beverage', 'drink', 'soda', 'water', 'chip', 'nut', 'cracker', 'cookie',
    'chocolate', 'candy', 'ice cream', 'cereal', 'pasta', 'rice', 'grain', 'flour',
    'soup', 'canned', 'jam', 'jelly', 'honey', 'sugar', 'salt', 'spice', 'sauce',
    'condiment', 'oil', 'vinegar', 'cleaning', 'supplies', 'vitamin', 'supplement'
  ];
  
  const lowerCaseName = categoryName.toLowerCase();
  return groceryKeywords.some(keyword => lowerCaseName.includes(keyword));
};

// Helper to get category emoji based on name
export const getCategoryEmoji = (categoryName: string): string => {
  const emojiMap: Record<string, string> = {
    // Fruits
    'apple': '🍎',
    'berries': '🫐',
    'berry': '🫐',
    'citrus': '🍊',
    'melons': '🍉',
    'tropical': '🥭',
    'stone': '🍑',
    
    // Vegetables
    'leafy': '🥬',
    'root': '🥕',
    'squash': '🎃',
    'pepper': '🌶️',
    'onion': '🧅',
    'mushroom': '🍄',
    
    // Dairy
    'dairy': '🥛',
    'milk': '🥛',
    'cheese': '🧀',
    'yogurt': '🥛',
    'eggs': '🥚',
    'egg': '🥚',
    'butter': '🧈',
    'cream': '🥛',
    
    // Meat
    'beef': '🥩',
    'chicken': '🍗',
    'pork': '🥓',
    'fish': '🐟',
    'seafood': '🦐',
    'meat': '🥩',
    'lamb': '🥩',
    'turkey': '🦃',
    
    // Bakery
    'bread': '🍞',
    'pastry': '🥐',
    'cookies': '🍪',
    'cookie': '🍪',
    'cake': '🍰',
    'muffin': '🧁',
    'croissant': '🥐',
    'danish': '🥐',
    'bakery': '🍞',
    
    // Pantry
    'rice': '🍚',
    'pasta': '🍝',
    'oil': '🫒',
    'spices': '🌶️',
    'canned': '🥫',
    'sauce': '🥫',
    'condiment': '🍯',
    'jam': '🍯',
    'honey': '🍯',
    'sugar': '🍯',
    'salt': '🧂',
    'flour': '🌾',
    'grain': '🌾',
    'cereal': '🥣',
    
    // Beverages
    'juice': '🧃',
    'coffee': '☕',
    'tea': '🍵',
    'water': '💧',
    'soda': '🥤',
    'beverage': '🥤',
    'drink': '🥤',
    
    // Snacks
    'nuts': '🥜',
    'nut': '🥜',
    'chips': '🍿',
    'chip': '🍿',
    'chocolate': '🍫',
    'candy': '🍬',
    'snack': '🍿',
    'cracker': '🍿',
    
    // Frozen
    'frozen': '🧊',
    'ice cream': '🍦',
    'soup': '🍲',
  };

  const name = categoryName.toLowerCase();
  
  // Find matching emoji
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (name.includes(key)) {
      return emoji;
    }
  }
  
  // Default emoji
  return '🏪';
};

// Helper to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Helper to generate product URL
export const getProductUrl = (product: Product): string => {
  return `/product/${product.slug}`;
};

// Helper to generate category URL
export const getCategoryUrl = (category: Category): string => {
  return `/products?category=${category.slug}`;
};