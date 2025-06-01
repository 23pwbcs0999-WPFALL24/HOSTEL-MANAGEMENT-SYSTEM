import express from "express";
import addInventoryitem from "../controllers/inventoryController.js";

const router = express.Router()

router.post('/', addInventoryitem);

export default router;