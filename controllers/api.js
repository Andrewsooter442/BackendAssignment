import kitchenModels from "../models/kitchenModels.js";

async function handelPlaceOrder(req, res) {
    try {
        const orderData = JSON.parse(req.body.orderData);

        const writeToDB = await kitchenModels.placeOrder(orderData, req.clientObj);

        orderData.orderId = writeToDB;

        res.render("payment.ejs", { orders: orderData, clientObj: req.clientObj });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server cannot place the order" });
    }
}
async function handelPostPaymentDone (req,res){
    try {
        console.log(req.body,req.clientObj);
        const writeToDB = await kitchenModels.makePayment(req.body,req.clientObj);
        res.redirect('/');
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
        res.render("payment.ejs",{orders: req.body, clientObj: req.clientObj});
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
        await kitchenModels.editItemById(req.body);
        res.redirect('/');
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "internal server cannot Edit the item" });
    }
    
}

export { handelPlaceOrder, handelCompleteOrder, handelGetEditItem, handelPostEditItem,handelGetLogout ,handelGetPayment, handelPostPaymentDone};