import UserModels from "../models/userModels.js";
import kitchenModels from "../models/kitchenModels.js";

async function handelGetHome(req, res) {
    try {

        const is_admin = await UserModels.isUserAdmin(req.clientObj.Id);
        const is_cheff = await UserModels.isUserCheff(req.clientObj.Id);
        req.clientObj.isAdmin = is_admin;
        req.clientObj.isCheff = is_cheff;
        //console.log("comming from controller kitchen. ")
        //console.log(menu);
            const orders = await kitchenModels.getItemOrdersNotCompleted();
            const items = await kitchenModels.getItems();

        if (req.clientObj.isCheff){
            //console.log("comming from controllers kitchen.")
            //console.log(orders);
            res.render("homeCheff.ejs", {orders: orders, items: items, clientObj: req.clientObj});
        }
        else{
            const menu = await kitchenModels.getCategoriesAndItems();
            res.render("home.ejs", { menu: menu, clientObj: req.clientObj,orders: orders, items: items });
        }
        //console.log('Data sent to home.ejs');
        //console.log(JSON.stringify(menu, null, 2));


    } catch (error) {
        console.error("Error handling home route:", error);
        res.status(500).send("Sorry, something went wrong on our end.");
    }
}

export { handelGetHome };