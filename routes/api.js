import express from "express";
import { handelPlaceOrder, handelCompleteOrder, handelGetEditItem, handelPostEditItem,handelGetLogout} from "../controllers/api.js";

const router = express.Router();

router.get('/editItem/:item_id',handelGetEditItem);
router.post('/editItem/:item_id',handelPostEditItem);


router.post('/placeOrder',handelPlaceOrder);
router.post('/completeOrder',handelCompleteOrder);

router.get('/logout',handelGetLogout);


export { router };