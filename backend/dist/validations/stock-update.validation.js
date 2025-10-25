import Joi from 'joi';
const createStockUpdate = {
    body: Joi.object().keys({
        itemId: Joi.string().required(),
        oldQuantity: Joi.number().min(0).required(),
        newQuantity: Joi.number().min(0).required(),
        notes: Joi.string()
    })
};
const getStockUpdates = {
    query: Joi.object().keys({
        itemId: Joi.string(),
        startDate: Joi.string().isoDate(),
        endDate: Joi.string().isoDate(),
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        sortBy: Joi.string()
    })
};
const getStockUpdate = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};
const getItemStockUpdates = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        sortBy: Joi.string()
    })
};
export default {
    createStockUpdate,
    getStockUpdates,
    getStockUpdate,
    getItemStockUpdates
};
