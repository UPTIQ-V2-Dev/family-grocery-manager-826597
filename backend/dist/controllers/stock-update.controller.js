import { stockUpdateService } from "../services/index.js";
import ApiError from "../utils/ApiError.js";
import catchAsyncWithAuth from "../utils/catchAsyncWithAuth.js";
import pick from "../utils/pick.js";
import httpStatus from 'http-status';
const createStockUpdate = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const updatedBy = req.user.name || req.user.email;
    const stockUpdate = await stockUpdateService.createStockUpdate(req.body, userId, updatedBy);
    res.status(httpStatus.CREATED).send(stockUpdate);
});
const getStockUpdates = catchAsyncWithAuth(async (req, res) => {
    const filter = pick(req.validatedQuery, ['itemId', 'startDate', 'endDate']);
    const options = pick(req.validatedQuery, ['sortBy', 'limit', 'page']);
    const userId = req.user.id;
    const result = await stockUpdateService.queryStockUpdates(filter, options, userId);
    res.send(result);
});
const getStockUpdate = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const stockUpdate = await stockUpdateService.getStockUpdateById(req.params.id, userId);
    if (!stockUpdate) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Stock update not found');
    }
    res.send(stockUpdate);
});
const getItemStockUpdates = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const options = pick(req.validatedQuery, ['sortBy', 'limit', 'page']);
    const result = await stockUpdateService.getStockUpdatesByItemId(req.params.id, options, userId);
    res.send(result);
});
export default {
    createStockUpdate,
    getStockUpdates,
    getStockUpdate,
    getItemStockUpdates
};
