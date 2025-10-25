import { StockLevel, ItemUnit } from '../types/item';

export const getStockLevelColor = (stockLevel: StockLevel): string => {
    switch (stockLevel) {
        case 'high':
            return 'bg-green-100 text-green-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-orange-100 text-orange-800';
        case 'out':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getStockLevelText = (stockLevel: StockLevel): string => {
    switch (stockLevel) {
        case 'high':
            return 'In Stock';
        case 'medium':
            return 'Medium Stock';
        case 'low':
            return 'Low Stock';
        case 'out':
            return 'Out of Stock';
        default:
            return 'Unknown';
    }
};

export const calculateStockLevel = (quantity: number, minStockLevel: number): StockLevel => {
    if (quantity === 0) return 'out';
    if (quantity <= minStockLevel) return 'low';
    if (quantity <= minStockLevel * 2) return 'medium';
    return 'high';
};

export const formatQuantity = (quantity: number, unit: ItemUnit): string => {
    return `${quantity} ${unit}${quantity !== 1 && !['ml', 'gram'].includes(unit) ? 's' : ''}`;
};

export const formatPrice = (price?: number): string => {
    if (!price) return 'N/A';
    return `₹${price.toFixed(2)}`;
};

export const formatLastUpdated = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
};

export const UNIT_OPTIONS: { value: ItemUnit; label: string }[] = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'gram', label: 'Gram (g)' },
    { value: 'liter', label: 'Liter (L)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'piece', label: 'Piece' },
    { value: 'packet', label: 'Packet' },
    { value: 'bottle', label: 'Bottle' }
];
