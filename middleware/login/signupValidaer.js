import UserModels from "../../models/userModels.js";
import bcrypt from 'bcryptjs';
async function validateSignupData(req, res, next) {
    const { name, mail, phone, password } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).send("Name is required.");
    }

    const exists = await UserModels.checkUserExists(name);
    if (exists){
        return res.status(400).send("Name already exists.");
    }

    if (!mail || mail.trim() === '' || !mail.includes('@') || !mail.includes('.')) {
        return res.status(400).send("A valid email address is required.");
    }

    if (!password || password.length < 5) {
        return res.status(400).send("Password must be at least 6 characters long.");
    }

    //Password hashing
    try{
    const salt = await bcrypt.genSalt(10);
        req.body.hashedPassword = await bcrypt.hash(password, salt);
    }
    catch(error) {
        console.error(`Error creating password hash ${error}. `)
        return res.status(500).send("Failed to create user.");
    }
    finally{
        delete req.body.password;
    }


    //Default score is 0
    req.body.score = 0;
    req.body.is_admin= false;

    next();
}

export { validateSignupData };
