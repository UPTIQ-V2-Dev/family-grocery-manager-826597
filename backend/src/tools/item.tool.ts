import { itemService } from '../services/index.ts';
import { MCPTool } from '../types/mcp.ts';
import pick from '../utils/pick.ts';
import { z } from 'zod';

// Valid enums for validation
const VALID_CATEGORIES = [
    'dal',
    'rice',
    'spices',
    'oil',
    'vegetables',
    'fruits',
    'dairy',
    'snacks',
    'condiments',
    'soap',
    'cleaning',
    'others'
] as const;

const VALID_STOCK_LEVELS = ['high', 'medium', 'low', 'out'] as const;
const VALID_UNITS = ['kg', 'gram', 'liter', 'ml', 'piece', 'packet', 'bottle'] as const;

const itemSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    brand: z.string().nullable(),
    quantity: z.number(),
    unit: z.string(),
    stockLevel: z.string(),
    minStockLevel: z.number(),
    price: z.number().nullable(),
    lastUpdated: z.string(),
    updatedBy: z.string(),
    notes: z.string().nullable(),
    imageUrl: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
});

const createItemTool: MCPTool = {
    id: 'item_create',
    name: 'Create Item',
    description: 'Create a new grocery item in inventory',
    inputSchema: z.object({
        name: z.string().min(1),
        category: z.enum(VALID_CATEGORIES),
        brand: z.string().optional(),
        quantity: z.number().min(0),
        unit: z.enum(VALID_UNITS),
        minStockLevel: z.number().min(0),
        price: z.number().min(0).optional(),
        notes: z.string().optional(),
        userId: z.number().int(),
        updatedBy: z.string()
    }),
    outputSchema: itemSchema,
    fn: async (inputs: {
        name: string;
        category: string;
        brand?: string;
        quantity: number;
        unit: string;
        minStockLevel: number;
        price?: number;
        notes?: string;
        userId: number;
        updatedBy: string;
    }) => {
        const itemData = {
            name: inputs.name,
            category: inputs.category,
            brand: inputs.brand,
            quantity: inputs.quantity,
            unit: inputs.unit,
            minStockLevel: inputs.minStockLevel,
            price: inputs.price,
            notes: inputs.notes
        };
        const item = await itemService.createItem(itemData, inputs.userId, inputs.updatedBy);
        return item;
    }
};

const getItemsTool: MCPTool = {
    id: 'item_get_all',
    name: 'Get All Items',
    description: 'Get all grocery items with optional filters and pagination',
    inputSchema: z.object({
        category: z.enum(VALID_CATEGORIES).optional(),
        stockLevel: z.enum(VALID_STOCK_LEVELS).optional(),
        search: z.string().optional(),
        page: z.number().int().min(1).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        sortBy: z.string().optional(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        results: z.array(itemSchema),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        totalResults: z.number()
    }),
    fn: async (inputs: {
        category?: string;
        stockLevel?: string;
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        userId: number;
    }) => {
        const filter = pick(inputs, ['category', 'stockLevel']);
        const options = pick(inputs, ['search', 'page', 'limit', 'sortBy']);
        const result = await itemService.queryItems(filter, options, inputs.userId);
        return result;
    }
};

const getItemByIdTool: MCPTool = {
    id: 'item_get_by_id',
    name: 'Get Item By ID',
    description: 'Get a single grocery item by its ID',
    inputSchema: z.object({
        id: z.string(),
        userId: z.number().int()
    }),
    outputSchema: itemSchema,
    fn: async (inputs: { id: string; userId: number }) => {
        const item = await itemService.getItemById(inputs.id, inputs.userId);
        if (!item) {
            throw new Error('Item not found');
        }
        return item;
    }
};

const updateItemTool: MCPTool = {
    id: 'item_update',
    name: 'Update Item',
    description: 'Update grocery item information by ID',
    inputSchema: z.object({
        id: z.string(),
        name: z.string().optional(),
        category: z.enum(VALID_CATEGORIES).optional(),
        brand: z.string().optional(),
        quantity: z.number().min(0).optional(),
        unit: z.enum(VALID_UNITS).optional(),
        minStockLevel: z.number().min(0).optional(),
        price: z.number().min(0).optional(),
        notes: z.string().optional(),
        userId: z.number().int(),
        updatedBy: z.string()
    }),
    outputSchema: itemSchema,
    fn: async (inputs: {
        id: string;
        name?: string;
        category?: string;
        brand?: string;
        quantity?: number;
        unit?: string;
        minStockLevel?: number;
        price?: number;
        notes?: string;
        userId: number;
        updatedBy: string;
    }) => {
        const updateData = pick(inputs, [
            'name',
            'category',
            'brand',
            'quantity',
            'unit',
            'minStockLevel',
            'price',
            'notes'
        ]);
        const item = await itemService.updateItemById(inputs.id, updateData, inputs.userId, inputs.updatedBy);
        return item;
    }
};

const deleteItemTool: MCPTool = {
    id: 'item_delete',
    name: 'Delete Item',
    description: 'Delete a grocery item by its ID',
    inputSchema: z.object({
        id: z.string(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        success: z.boolean(),
        deletedItem: itemSchema
    }),
    fn: async (inputs: { id: string; userId: number }) => {
        const deletedItem = await itemService.deleteItemById(inputs.id, inputs.userId);
        return { success: true, deletedItem };
    }
};

export const itemTools: MCPTool[] = [createItemTool, getItemsTool, getItemByIdTool, updateItemTool, deleteItemTool];
