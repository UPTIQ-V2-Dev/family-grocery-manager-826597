export type ItemCategory =
    | 'dal'
    | 'rice'
    | 'spices'
    | 'oil'
    | 'vegetables'
    | 'fruits'
    | 'dairy'
    | 'snacks'
    | 'condiments'
    | 'soap'
    | 'cleaning'
    | 'others';

export type StockLevel = 'high' | 'medium' | 'low' | 'out';

export type ItemUnit = 'kg' | 'gram' | 'liter' | 'ml' | 'piece' | 'packet' | 'bottle';

export interface GroceryItem {
    id: string;
    name: string;
    category: ItemCategory;
    brand?: string;
    quantity: number;
    unit: ItemUnit;
    stockLevel: StockLevel;
    minStockLevel: number;
    price?: number;
    lastUpdated: string;
    updatedBy: string;
    notes?: string;
    imageUrl?: string;
}

export interface CreateItemInput {
    name: string;
    category: ItemCategory;
    brand?: string;
    quantity: number;
    unit: ItemUnit;
    minStockLevel: number;
    price?: number;
    notes?: string;
}

export interface UpdateItemInput {
    id: string;
    name?: string;
    category?: ItemCategory;
    brand?: string;
    quantity?: number;
    unit?: ItemUnit;
    minStockLevel?: number;
    price?: number;
    notes?: string;
}

export interface ItemFilters {
    category?: ItemCategory;
    stockLevel?: StockLevel;
    search?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: ItemCategory;
    icon: string;
    color: string;
    itemCount: number;
}

export interface StockUpdate {
    itemId: string;
    newQuantity: number;
    updatedBy: string;
}
