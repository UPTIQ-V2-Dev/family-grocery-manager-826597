import { itemService } from '../services/index.ts';
import ApiError from '../utils/ApiError.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import pick from '../utils/pick.ts';
import httpStatus from 'http-status';

const createItem = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const updatedBy = req.user.name || req.user.email;
    const item = await itemService.createItem(req.body, userId, updatedBy);
    res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsyncWithAuth(async (req, res) => {
    const filter = pick(req.validatedQuery, ['category', 'stockLevel']);
    const options = pick(req.validatedQuery, ['sortBy', 'limit', 'page', 'search']);
    const userId = req.user.id;
    const result = await itemService.queryItems(filter, options, userId);
    res.send(result);
});

const getItem = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const item = await itemService.getItemById(req.params.id, userId);
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    res.send(item);
});

const updateItem = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const updatedBy = req.user.name || req.user.email;
    const item = await itemService.updateItemById(req.params.id, req.body, userId, updatedBy);
    res.send(item);
});

const deleteItem = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    await itemService.deleteItemById(req.params.id, userId);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
};
