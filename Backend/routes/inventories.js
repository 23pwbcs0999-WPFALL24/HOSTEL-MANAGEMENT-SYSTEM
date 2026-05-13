import express from "express";
import { addInventoryItem, getInventory, deleteInventoryItem, updateInventoryItem } from "../controllers/inventoryController.js";

const router = express.Router();

router.get('/', getInventory);
router.post('/', addInventoryItem);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;