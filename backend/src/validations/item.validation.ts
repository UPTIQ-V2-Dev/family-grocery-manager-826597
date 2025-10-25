import Joi from 'joi';

// Valid categories, stock levels, and units as constants
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
];

const VALID_STOCK_LEVELS = ['high', 'medium', 'low', 'out'];

const VALID_UNITS = ['kg', 'gram', 'liter', 'ml', 'piece', 'packet', 'bottle'];

const createItem = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        category: Joi.string()
            .required()
            .valid(...VALID_CATEGORIES),
        brand: Joi.string(),
        quantity: Joi.number().min(0).required(),
        unit: Joi.string()
            .required()
            .valid(...VALID_UNITS),
        minStockLevel: Joi.number().min(0).required(),
        price: Joi.number().min(0),
        notes: Joi.string()
    })
};

const getItems = {
    query: Joi.object().keys({
        category: Joi.string().valid(...VALID_CATEGORIES),
        stockLevel: Joi.string().valid(...VALID_STOCK_LEVELS),
        search: Joi.string(),
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        sortBy: Joi.string()
    })
};

const getItem = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};

const updateItem = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            category: Joi.string().valid(...VALID_CATEGORIES),
            brand: Joi.string(),
            quantity: Joi.number().min(0),
            unit: Joi.string().valid(...VALID_UNITS),
            minStockLevel: Joi.number().min(0),
            price: Joi.number().min(0),
            notes: Joi.string()
        })
        .min(1)
};

const deleteItem = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};

export default {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
};
