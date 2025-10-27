import { api } from '../lib/api';
import { GroceryItem, CreateItemInput, UpdateItemInput, ItemFilters } from '../types/item';
import { MOCK_ITEMS } from '../data/mockItems';

export const itemsService = {
    getAllItems: async (filters?: ItemFilters): Promise<GroceryItem[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            let items = [...MOCK_ITEMS];

            if (filters?.category) {
                items = items.filter(item => item.category === filters.category);
            }

            if (filters?.stockLevel) {
                items = items.filter(item => item.stockLevel === filters.stockLevel);
            }

            if (filters?.search) {
                const searchTerm = filters.search.toLowerCase();
                items = items.filter(
                    item =>
                        item.name.toLowerCase().includes(searchTerm) ||
                        (item.brand && item.brand.toLowerCase().includes(searchTerm))
                );
            }

            return items;
        }

        const response = await api.get('/items', { params: filters });
        // Ensure we return an array - handle different response structures
        const data = response.data;
        return Array.isArray(data) ? data : data?.items || data?.data || [];
    },

    getItemById: async (id: string): Promise<GroceryItem> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const item = MOCK_ITEMS.find(item => item.id === id);
            if (!item) {
                throw new Error('Item not found');
            }
            return item;
        }

        const response = await api.get(`/items/${id}`);
        // Handle different response structures
        const data = response.data;
        return data?.item || data?.data || data;
    },

    createItem: async (itemData: CreateItemInput): Promise<GroceryItem> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const newItem: GroceryItem = {
                id: Math.random().toString(36).substr(2, 9),
                ...itemData,
                stockLevel:
                    itemData.quantity > itemData.minStockLevel ? 'high' : itemData.quantity > 0 ? 'medium' : 'out',
                lastUpdated: new Date().toISOString(),
                updatedBy: 'Current User'
            };
            MOCK_ITEMS.push(newItem);
            return newItem;
        }

        const response = await api.post('/items', itemData);
        // Handle different response structures
        const data = response.data;
        return data?.item || data?.data || data;
    },

    updateItem: async (itemData: UpdateItemInput): Promise<GroceryItem> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const itemIndex = MOCK_ITEMS.findIndex(item => item.id === itemData.id);
            if (itemIndex === -1) {
                throw new Error('Item not found');
            }

            const updatedItem = {
                ...MOCK_ITEMS[itemIndex],
                ...itemData,
                lastUpdated: new Date().toISOString(),
                updatedBy: 'Current User'
            };

            if (itemData.quantity !== undefined) {
                updatedItem.stockLevel =
                    itemData.quantity > updatedItem.minStockLevel ? 'high' : itemData.quantity > 0 ? 'medium' : 'out';
            }

            MOCK_ITEMS[itemIndex] = updatedItem;
            return updatedItem;
        }

        const response = await api.put(`/items/${itemData.id}`, itemData);
        // Handle different response structures
        const data = response.data;
        return data?.item || data?.data || data;
    },

    deleteItem: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const itemIndex = MOCK_ITEMS.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                MOCK_ITEMS.splice(itemIndex, 1);
            }
            return;
        }

        await api.delete(`/items/${id}`);
    },

    updateStock: async (itemId: string, newQuantity: number): Promise<GroceryItem> => {
        return itemsService.updateItem({ id: itemId, quantity: newQuantity });
    }
};
