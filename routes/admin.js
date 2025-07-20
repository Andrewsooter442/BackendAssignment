import express from "express";
import * as adminController from "../controllers/admin.js";

const router = express.Router();

// Category routers
router.get('/addCategory', adminController.handelGetAddCategoryPage);
router.post('/addCategory', adminController.handelPostAddCategory);

router.get('/editCategory/:id', adminController.handelGetEditCategoryPage);
router.post('/editCategory/:id', adminController.handelPostEditCategory);

// Item routers
router.get('/addItem', adminController.handelGetAddItemPage);
router.post('/addItem', adminController.handelPostAddItem);

router.get('/editItem/:id', adminController.handelGetEditItemPage);
router.post('/editItem/:id', adminController.handelPostEditItem);

router.get('/viewOldOrders', adminController.handelGetViewOldOrders)

export { router };
