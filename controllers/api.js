import kitchenModels from "../models/kitchenModels.js";

async function handelPlaceOrder(req, res) {
    try {
        const writeToDB = await kitchenModels.placeOrder(req.body,req.clientObj);
        res.redirect('/api');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server cannot place the order" });
    }
}
async function handelCompleteOrder(req,res) {

    try{
        const [sink]= await kitchenModels.markComplete(req.body.orderId, req.body.itemId);
        res.redirect('/');
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal server cannot place the order" });
    }
    
}

async function handelGetLogout(req,res) {
    res.clearCookie('token');
    res.redirect('/login');
}

async function handelGetPayment(req,res) {
    try{
        const orders = await kitchenModels.getItemOrdersNotCompleted();
        const items = await kitchenModels.getItems();
        res.render("payment.ejs",{orders: orders, items: items, clientObj: req.clientObj});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal server cannot place the order" });
    }
 
}



async function handelGetEditItem(req,res) {
    try{
        const item_id = req.params.item_id;
        const [item] = await kitchenModels.getItemById(item_id);
        //console.log("comming from controller api");
        //console.log(item[0]);
        res.render("itemEdit.ejs",{item: item});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "internal server cannot place the order" });
    }
}

async function handelPostEditItem(req,res) {
    try{
        req.body.item_id = req.params.item_id;
        //console.log("comming from controller api")
        //console.log(req.body.item_id);
        await kitchenModels.editItemById(req.body);
        res.redirect('/');
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "internal server cannot Edit the item" });
    }
    
}

export { handelPlaceOrder, handelCompleteOrder, handelGetEditItem, handelPostEditItem,handelGetLogout ,handelGetPayment};