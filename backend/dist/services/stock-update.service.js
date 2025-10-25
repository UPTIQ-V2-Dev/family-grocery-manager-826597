import prisma from "../client.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from 'http-status';
/**
 * Create a stock update and update the related item quantity
 * @param {Object} stockUpdateBody
 * @param {number} userId
 * @param {string} updatedBy
 * @returns {Promise<StockUpdate>}
 */
const createStockUpdate = async (stockUpdateBody, userId, updatedBy) => {
    // First, verify that the item exists and belongs to the user
    const item = await prisma.item.findUnique({
        where: { id: stockUpdateBody.itemId }
    });
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    if (item.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this item');
    }
    // Verify that the oldQuantity matches the current item quantity
    if (item.quantity !== stockUpdateBody.oldQuantity) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Old quantity does not match current item quantity');
    }
    // Create the stock update and update the item in a transaction
    const result = await prisma.$transaction(async (tx) => {
        // Create stock update
        const stockUpdate = await tx.stockUpdate.create({
            data: {
                ...stockUpdateBody,
                userId,
                updatedBy
            }
        });
        // Calculate new stock level based on new quantity
        const stockLevel = calculateStockLevel(stockUpdateBody.newQuantity, item.minStockLevel);
        // Update the item with new quantity and lastUpdated
        await tx.item.update({
            where: { id: stockUpdateBody.itemId },
            data: {
                quantity: stockUpdateBody.newQuantity,
                stockLevel,
                lastUpdated: new Date(),
                updatedBy
            }
        });
        return stockUpdate;
    });
    return result;
};
/**
 * Query for stock updates with filtering and pagination
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} userId - User ID to filter by
 * @returns {Promise<{results: StockUpdate[], page: number, limit: number, totalPages: number, totalResults: number}>}
 */
const queryStockUpdates = async (filter, options, userId) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    // Build where clause
    const whereClause = {
        userId,
        ...(filter.itemId && { itemId: filter.itemId })
    };
    // Add date range filtering if provided
    if (filter.startDate || filter.endDate) {
        whereClause.createdAt = {};
        if (filter.startDate) {
            whereClause.createdAt.gte = new Date(filter.startDate);
        }
        if (filter.endDate) {
            whereClause.createdAt.lte = new Date(filter.endDate);
        }
    }
    // Build orderBy clause
    let orderBy = { createdAt: 'desc' }; // Default sort
    if (sortBy) {
        const [field, direction] = sortBy.split(':');
        orderBy = { [field]: direction === 'asc' ? 'asc' : 'desc' };
    }
    const [stockUpdates, totalResults] = await Promise.all([
        prisma.stockUpdate.findMany({
            where: whereClause,
            include: {
                item: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        unit: true
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy
        }),
        prisma.stockUpdate.count({ where: whereClause })
    ]);
    const totalPages = Math.ceil(totalResults / limit);
    return {
        results: stockUpdates,
        page,
        limit,
        totalPages,
        totalResults
    };
};
/**
 * Get stock update by id
 * @param {string} id
 * @param {number} userId - User ID to ensure access control
 * @returns {Promise<StockUpdate | null>}
 */
const getStockUpdateById = async (id, userId) => {
    const stockUpdate = await prisma.stockUpdate.findUnique({
        where: { id },
        include: {
            item: {
                select: {
                    id: true,
                    name: true,
                    category: true,
                    unit: true
                }
            }
        }
    });
    if (!stockUpdate) {
        return null;
    }
    // Check if user owns this stock update
    if (stockUpdate.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this stock update');
    }
    return stockUpdate;
};
/**
 * Get stock updates for a specific item
 * @param {string} itemId
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} userId - User ID to ensure access control
 * @returns {Promise<{results: StockUpdate[], page: number, limit: number, totalPages: number, totalResults: number}>}
 */
const getStockUpdatesByItemId = async (itemId, options, userId) => {
    // First verify the item exists and belongs to the user
    const item = await prisma.item.findUnique({
        where: { id: itemId }
    });
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    if (item.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this item');
    }
    // Use existing query function with itemId filter
    return queryStockUpdates({ itemId }, options, userId);
};
/**
 * Calculate stock level based on quantity vs minStockLevel
 * @param {number} quantity
 * @param {number} minStockLevel
 * @returns {string}
 */
const calculateStockLevel = (quantity, minStockLevel) => {
    if (quantity === 0) {
        return 'out';
    }
    else if (quantity <= minStockLevel * 0.5) {
        return 'low';
    }
    else if (quantity <= minStockLevel) {
        return 'medium';
    }
    else {
        return 'high';
    }
};
export default {
    createStockUpdate,
    queryStockUpdates,
    getStockUpdateById,
    getStockUpdatesByItemId
};
