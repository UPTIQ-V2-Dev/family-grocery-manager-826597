import { itemController, stockUpdateController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { itemValidation, stockUpdateValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// Authenticated routes
router
    .route('/')
    .post(auth('manageOwnItems'), validate(itemValidation.createItem), itemController.createItem)
    .get(auth('getOwnItems'), validate(itemValidation.getItems), itemController.getItems);
router
    .route('/:id')
    .get(auth('getOwnItems'), validate(itemValidation.getItem), itemController.getItem)
    .put(auth('manageOwnItems'), validate(itemValidation.updateItem), itemController.updateItem)
    .delete(auth('manageOwnItems'), validate(itemValidation.deleteItem), itemController.deleteItem);
router
    .route('/:id/stock-updates')
    .get(auth('getOwnItems'), validate(stockUpdateValidation.getItemStockUpdates), stockUpdateController.getItemStockUpdates);
export default router;
/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Grocery item inventory management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the item
 *         name:
 *           type: string
 *           description: Name of the grocery item
 *         category:
 *           type: string
 *           enum: [dal, rice, spices, oil, vegetables, fruits, dairy, snacks, condiments, soap, cleaning, others]
 *           description: Category of the item
 *         brand:
 *           type: string
 *           description: Brand name of the item
 *         quantity:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Current quantity in stock
 *         unit:
 *           type: string
 *           enum: [kg, gram, liter, ml, piece, packet, bottle]
 *           description: Unit of measurement
 *         stockLevel:
 *           type: string
 *           enum: [high, medium, low, out]
 *           description: Calculated stock level based on quantity and minimum stock level
 *         minStockLevel:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Minimum stock level threshold
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Price of the item
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: When the item was last updated
 *         updatedBy:
 *           type: string
 *           description: Who updated the item last
 *         notes:
 *           type: string
 *           description: Additional notes about the item
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL of item image
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the item was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the item was last updated
 *       example:
 *         id: "clxyz123456"
 *         name: "Toor Dal"
 *         category: "dal"
 *         brand: "Fortune"
 *         quantity: 2
 *         unit: "kg"
 *         stockLevel: "high"
 *         minStockLevel: 1
 *         price: 180
 *         lastUpdated: "2024-01-20T10:30:00Z"
 *         updatedBy: "John Doe"
 *         notes: "Buy organic variety next time"
 */
/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new grocery item
 *     description: Add a new item to the grocery inventory
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - quantity
 *               - unit
 *               - minStockLevel
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the grocery item
 *               category:
 *                 type: string
 *                 enum: [dal, rice, spices, oil, vegetables, fruits, dairy, snacks, condiments, soap, cleaning, others]
 *               brand:
 *                 type: string
 *                 description: Brand name (optional)
 *               quantity:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               unit:
 *                 type: string
 *                 enum: [kg, gram, liter, ml, piece, packet, bottle]
 *               minStockLevel:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               notes:
 *                 type: string
 *             example:
 *               name: "Moong Dal"
 *               category: "dal"
 *               brand: "Tata"
 *               quantity: 1.5
 *               unit: "kg"
 *               minStockLevel: 0.5
 *               price: 120
 *               notes: "Yellow moong dal"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "422":
 *         description: Item with this name already exists
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Get all grocery items
 *     description: Retrieve all grocery items with optional filtering and pagination
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [dal, rice, spices, oil, vegetables, fruits, dairy, snacks, condiments, soap, cleaning, others]
 *         description: Filter by category
 *       - in: query
 *         name: stockLevel
 *         schema:
 *           type: string
 *           enum: [high, medium, low, out]
 *         description: Filter by stock level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in item names
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         default: 10
 *         description: Maximum number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field:direction (e.g., name:asc, lastUpdated:desc)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get a grocery item by ID
 *     description: Retrieve a specific grocery item by its ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Not authorized to access this item
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   put:
 *     summary: Update a grocery item
 *     description: Update an existing grocery item by ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [dal, rice, spices, oil, vegetables, fruits, dairy, snacks, condiments, soap, cleaning, others]
 *               brand:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               unit:
 *                 type: string
 *                 enum: [kg, gram, liter, ml, piece, packet, bottle]
 *               minStockLevel:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               notes:
 *                 type: string
 *             example:
 *               quantity: 3
 *               price: 200
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Not authorized to update this item
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   delete:
 *     summary: Delete a grocery item
 *     description: Remove a grocery item from inventory permanently
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Not authorized to delete this item
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /items/{id}/stock-updates:
 *   get:
 *     summary: Get stock updates for an item
 *     description: Retrieve all stock updates for a specific item with pagination
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         default: 10
 *         description: Maximum number of stock updates per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field:direction (e.g., createdAt:desc, newQuantity:asc)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       itemId:
 *                         type: string
 *                       oldQuantity:
 *                         type: number
 *                         format: float
 *                       newQuantity:
 *                         type: number
 *                         format: float
 *                       updatedBy:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 5
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Not authorized to access this item
 *       "404":
 *         description: Item not found
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
