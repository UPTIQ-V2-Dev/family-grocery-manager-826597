import { stockUpdateController } from '../../controllers/index.ts';
import auth from '../../middlewares/auth.ts';
import validate from '../../middlewares/validate.ts';
import { stockUpdateValidation } from '../../validations/index.ts';
import express from 'express';

const router = express.Router();

// Authenticated routes
router
    .route('/')
    .post(
        auth('manageOwnItems'),
        validate(stockUpdateValidation.createStockUpdate),
        stockUpdateController.createStockUpdate
    )
    .get(auth('getOwnItems'), validate(stockUpdateValidation.getStockUpdates), stockUpdateController.getStockUpdates);

router
    .route('/:id')
    .get(auth('getOwnItems'), validate(stockUpdateValidation.getStockUpdate), stockUpdateController.getStockUpdate);

export default router;

/**
 * @swagger
 * tags:
 *   name: Stock Updates
 *   description: Grocery inventory stock update tracking
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StockUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the stock update
 *         itemId:
 *           type: string
 *           description: ID of the item being updated
 *         oldQuantity:
 *           type: number
 *           format: float
 *           description: Previous quantity before update
 *         newQuantity:
 *           type: number
 *           format: float
 *           description: New quantity after update
 *         updatedBy:
 *           type: string
 *           description: Who made the update
 *         notes:
 *           type: string
 *           description: Additional notes about the update
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the stock update was created
 *         item:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             category:
 *               type: string
 *             unit:
 *               type: string
 *       example:
 *         id: "clxyz789012"
 *         itemId: "clxyz123456"
 *         oldQuantity: 2.0
 *         newQuantity: 1.5
 *         updatedBy: "John Doe"
 *         notes: "Used for cooking today"
 *         createdAt: "2024-01-20T10:30:00Z"
 *         item:
 *           id: "clxyz123456"
 *           name: "Toor Dal"
 *           category: "dal"
 *           unit: "kg"
 */

/**
 * @swagger
 * /stock-updates:
 *   post:
 *     summary: Create a new stock update
 *     description: Record a stock update for an item and automatically update the item's quantity
 *     tags: [Stock Updates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - oldQuantity
 *               - newQuantity
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of the item being updated
 *               oldQuantity:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Current quantity (must match item's current quantity)
 *               newQuantity:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: New quantity after update
 *               notes:
 *                 type: string
 *                 description: Additional notes about the update
 *             example:
 *               itemId: "clxyz123456"
 *               oldQuantity: 2.0
 *               newQuantity: 1.5
 *               notes: "Used for cooking today"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockUpdate'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Not authorized to update this item
 *       "404":
 *         description: Item not found
 *       "422":
 *         description: Old quantity does not match current item quantity
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Get all stock updates
 *     description: Retrieve all stock updates with optional filtering and pagination
 *     tags: [Stock Updates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: itemId
 *         schema:
 *           type: string
 *         description: Filter by item ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter updates from this date (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter updates to this date (ISO format)
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
 *                     $ref: '#/components/schemas/StockUpdate'
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
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /stock-updates/{id}:
 *   get:
 *     summary: Get a stock update by ID
 *     description: Retrieve a specific stock update by its ID
 *     tags: [Stock Updates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock update ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockUpdate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Not authorized to access this stock update
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
