import UserModels from "../../models/userModels.js";
import activeTables from "../../config/activeTables.js";
import jwt from "jsonwebtoken";

function assignTable(ID) {
  const tablesNo = activeTables.length;
  activeTables.push({ userId: ID, tableNo: tablesNo + 1 });
  return tablesNo + 1;
}

function generateToken(name, Id, table_no) {
  const payload = { name, Id, table_no };
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = "1d";
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}

async function validateLoginData(req, res) {
  const { name, password } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).send("Name is required.");
  }

  const exists = await UserModels.checkUserExists(name);
  if (!exists) {
    return res.status(400).send("User does not exist.");
  }

  const passwordMatched = await UserModels.checkUserPasswd(name, password);
  console.log(passwordMatched);
  if (!passwordMatched) {
    return res.status(401).send("Invalid credentials.");
  }
  else{
  //Send a JWT token
  const userId = await UserModels.getUserId(name);
  const is_admin = await UserModels.isUserAdmin(userId);
  const is_cheff = await UserModels.isUserCheff(userId);
  
  let table_no = assignTable(userId);
  if (is_cheff && is_admin) {
    table_no = 0;
  }
  const token = generateToken(name, userId, table_no);
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
}
}

export { validateLoginData };
