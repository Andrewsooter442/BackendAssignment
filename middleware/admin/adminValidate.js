import UserModels from "../../models/userModels.js";

async function validateAdminRequest(req, res, next){
    const {name} = req.clientObj;
    const userId = await UserModels.getUserId(name);
    const is_admin = await UserModels.isUserAdmin(userId);
//    const is_cheff = await UserModels.isUserCheff(userId);
    if(is_admin === 1){
        next();
    }else{
        res.status(403).send("You are not an admin");
    }
}
export {validateAdminRequest};