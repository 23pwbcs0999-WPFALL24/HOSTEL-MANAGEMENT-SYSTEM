import express from "express";
import { addInventoryItem, getInventory } from "../controllers/inventoryController.js";

const router = express.Router();

router.post('/', addInventoryItem);
router.get('/', getInventory);

export default router;