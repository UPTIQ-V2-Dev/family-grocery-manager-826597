import { stockUpdateService } from "../services/index.js";
import pick from "../utils/pick.js";
import { z } from 'zod';
const stockUpdateSchema = z.object({
    id: z.string(),
    itemId: z.string(),
    oldQuantity: z.number(),
    newQuantity: z.number(),
    updatedBy: z.string(),
    notes: z.string().nullable(),
    createdAt: z.string(),
    item: z
        .object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        unit: z.string()
    })
        .optional()
});
const createStockUpdateTool = {
    id: 'stock_update_create',
    name: 'Create Stock Update',
    description: 'Create a new stock update and automatically update the item quantity',
    inputSchema: z.object({
        itemId: z.string().min(1),
        oldQuantity: z.number().min(0),
        newQuantity: z.number().min(0),
        notes: z.string().optional(),
        userId: z.number().int(),
        updatedBy: z.string()
    }),
    outputSchema: stockUpdateSchema,
    fn: async (inputs) => {
        const stockUpdateData = {
            itemId: inputs.itemId,
            oldQuantity: inputs.oldQuantity,
            newQuantity: inputs.newQuantity,
            notes: inputs.notes
        };
        const stockUpdate = await stockUpdateService.createStockUpdate(stockUpdateData, inputs.userId, inputs.updatedBy);
        return stockUpdate;
    }
};
const getStockUpdatesTool = {
    id: 'stock_update_get_all',
    name: 'Get All Stock Updates',
    description: 'Get all stock updates with optional filters and pagination',
    inputSchema: z.object({
        itemId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        page: z.number().int().min(1).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        sortBy: z.string().optional(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        results: z.array(stockUpdateSchema),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        totalResults: z.number()
    }),
    fn: async (inputs) => {
        const filter = pick(inputs, ['itemId', 'startDate', 'endDate']);
        const options = pick(inputs, ['page', 'limit', 'sortBy']);
        const result = await stockUpdateService.queryStockUpdates(filter, options, inputs.userId);
        return result;
    }
};
const getStockUpdateByIdTool = {
    id: 'stock_update_get_by_id',
    name: 'Get Stock Update By ID',
    description: 'Get a single stock update by its ID',
    inputSchema: z.object({
        id: z.string(),
        userId: z.number().int()
    }),
    outputSchema: stockUpdateSchema,
    fn: async (inputs) => {
        const stockUpdate = await stockUpdateService.getStockUpdateById(inputs.id, inputs.userId);
        if (!stockUpdate) {
            throw new Error('Stock update not found');
        }
        return stockUpdate;
    }
};
const getItemStockUpdatesTool = {
    id: 'stock_update_get_by_item',
    name: 'Get Stock Updates By Item',
    description: 'Get all stock updates for a specific item with pagination',
    inputSchema: z.object({
        itemId: z.string(),
        page: z.number().int().min(1).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        sortBy: z.string().optional(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        results: z.array(stockUpdateSchema),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        totalResults: z.number()
    }),
    fn: async (inputs) => {
        const options = pick(inputs, ['page', 'limit', 'sortBy']);
        const result = await stockUpdateService.getStockUpdatesByItemId(inputs.itemId, options, inputs.userId);
        return result;
    }
};
export const stockUpdateTools = [
    createStockUpdateTool,
    getStockUpdatesTool,
    getStockUpdateByIdTool,
    getItemStockUpdatesTool
];
