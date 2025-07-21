import UserModels from "../../models/userModels.js";
import jwt from "jsonwebtoken";

function generateToken(name, Id) {
  const payload = { name, Id };
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = "1d";
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}

async function validateLoginData(req, res) {
  const { name, password } = req.body;

  if (!name || name.trim() === "") {
    return res.render("login", { error: "Username is required." });
  }

  const exists = await UserModels.checkUserExists(name);
  if (!exists) {
    return res.render("login", { error: "User does not exist." });
  }

  const passwordMatched = await UserModels.checkUserPasswd(name, password);
  console.log(passwordMatched); 
  if (!passwordMatched) {
    return res.render("login", { error: "Invalid username or password." });
  } else {
    const userId = await UserModels.getUserId(name);

    const token = generateToken(name, userId);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/"); 
  }
}

export { validateLoginData };