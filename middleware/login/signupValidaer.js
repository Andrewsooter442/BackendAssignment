import UserModels from "../../models/userModels.js";
import bcrypt from 'bcryptjs';

async function validateSignupData(req, res, next) {
    const { name, mail, phone, password } = req.body;

    if (!name || name.trim() === '') {
        return res.render("signup", { error: "Username is required." });
    }

    const exists = await UserModels.checkUserExists(name);
    if (exists) {
        return res.render("signup", { error: "Username already exists. Please choose a different one." });
    }

    if (!mail || mail.trim() === '' || !mail.includes('@') || !mail.includes('.')) {
        return res.render("signup", { error: "A valid email address is required (e.g., user@example.com)." });
    }

    if (!password || password.length < 6) { 
        return res.render("signup", { error: "Password must be at least 6 characters long." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        req.body.hashedPassword = await bcrypt.hash(password, salt);
    } catch (error) {
        console.error(`Error creating password hash: ${error}.`);
        return res.render("signup", { error: "Failed to create user due to a server error. Please try again." });
    } finally {
        delete req.body.password;
    }

    req.body.score = 0;
    req.body.is_admin = false;

    next();
}

export { validateSignupData };
