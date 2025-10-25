import prisma from '../client.ts';
import { Item } from '../generated/prisma/index.js';
import ApiError from '../utils/ApiError.ts';
import httpStatus from 'http-status';

/**
 * Create an item
 * @param {Object} itemBody
 * @param {number} userId
 * @param {string} updatedBy
 * @returns {Promise<Item>}
 */
const createItem = async (
    itemBody: {
        name: string;
        category: string;
        brand?: string;
        quantity: number;
        unit: string;
        minStockLevel: number;
        price?: number;
        notes?: string;
    },
    userId: number,
    updatedBy: string
): Promise<Item> => {
    // Check if item with same name already exists for this user
    const existingItem = await prisma.item.findFirst({
        where: {
            name: itemBody.name,
            userId: userId
        }
    });

    if (existingItem) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Item with this name already exists');
    }

    // Calculate stock level based on quantity vs minStockLevel
    const stockLevel = calculateStockLevel(itemBody.quantity, itemBody.minStockLevel);

    return prisma.item.create({
        data: {
            ...itemBody,
            userId,
            updatedBy,
            stockLevel,
            lastUpdated: new Date()
        }
    });
};

/**
 * Query for items with filtering, search and pagination
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.search] - Search term for name
 * @param {number} userId - User ID to filter by
 * @returns {Promise<{results: Item[], page: number, limit: number, totalPages: number, totalResults: number}>}
 */
const queryItems = async (
    filter: {
        category?: string;
        stockLevel?: string;
    },
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        search?: string;
    },
    userId: number
): Promise<{
    results: Item[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const search = options.search;

    // Build where clause
    const whereClause: any = {
        userId,
        ...(filter.category && { category: filter.category }),
        ...(filter.stockLevel && { stockLevel: filter.stockLevel }),
        ...(search && {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        })
    };

    // Build orderBy clause
    let orderBy: any = { lastUpdated: 'desc' }; // Default sort
    if (sortBy) {
        const [field, direction] = sortBy.split(':');
        orderBy = { [field]: direction === 'asc' ? 'asc' : 'desc' };
    }

    const [items, totalResults] = await Promise.all([
        prisma.item.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            orderBy
        }),
        prisma.item.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return {
        results: items,
        page,
        limit,
        totalPages,
        totalResults
    };
};

/**
 * Get item by id
 * @param {string} id
 * @param {number} userId - User ID to ensure access control
 * @returns {Promise<Item | null>}
 */
const getItemById = async (id: string, userId: number): Promise<Item | null> => {
    const item = await prisma.item.findUnique({
        where: { id }
    });

    if (!item) {
        return null;
    }

    // Check if user owns this item
    if (item.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this item');
    }

    return item;
};

/**
 * Update item by id
 * @param {string} itemId
 * @param {Object} updateBody
 * @param {number} userId
 * @param {string} updatedBy
 * @returns {Promise<Item>}
 */
const updateItemById = async (
    itemId: string,
    updateBody: {
        name?: string;
        category?: string;
        brand?: string;
        quantity?: number;
        unit?: string;
        minStockLevel?: number;
        price?: number;
        notes?: string;
    },
    userId: number,
    updatedBy: string
): Promise<Item> => {
    const item = await getItemById(itemId, userId);
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }

    // Check if updating name to a name that already exists for this user
    if (updateBody.name && updateBody.name !== item.name) {
        const existingItem = await prisma.item.findFirst({
            where: {
                name: updateBody.name,
                userId: userId,
                NOT: { id: itemId }
            }
        });

        if (existingItem) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Item with this name already exists');
        }
    }

    // Calculate new stock level if quantity or minStockLevel changed
    const newQuantity = updateBody.quantity ?? item.quantity;
    const newMinStockLevel = updateBody.minStockLevel ?? item.minStockLevel;
    const stockLevel = calculateStockLevel(newQuantity, newMinStockLevel);

    const updatedItem = await prisma.item.update({
        where: { id: item.id },
        data: {
            ...updateBody,
            stockLevel,
            lastUpdated: new Date(),
            updatedBy
        }
    });

    return updatedItem;
};

/**
 * Delete item by id
 * @param {string} itemId
 * @param {number} userId
 * @returns {Promise<Item>}
 */
const deleteItemById = async (itemId: string, userId: number): Promise<Item> => {
    const item = await getItemById(itemId, userId);
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }

    await prisma.item.delete({ where: { id: item.id } });
    return item;
};

/**
 * Calculate stock level based on quantity vs minStockLevel
 * @param {number} quantity
 * @param {number} minStockLevel
 * @returns {string}
 */
const calculateStockLevel = (quantity: number, minStockLevel: number): string => {
    if (quantity === 0) {
        return 'out';
    } else if (quantity <= minStockLevel * 0.5) {
        return 'low';
    } else if (quantity <= minStockLevel) {
        return 'medium';
    } else {
        return 'high';
    }
};

export default {
    createItem,
    queryItems,
    getItemById,
    updateItemById,
    deleteItemById
};
