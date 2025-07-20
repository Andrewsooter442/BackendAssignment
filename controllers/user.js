import userModels from "../models/userModels.js";
import kitchenModels from "../models/kitchenModels.js";

// User creations stuff.
async function handelCreateNewUser(req, res) {
  try {
    console.log(req.body);
    const { name, mail, phone, hashedPassword } = req.body;
    await userModels.createNewUser({ name, mail, phone, hashedPassword });
  } catch (error) {
    console.error(`Error creating new user ${error}.`);
    req.status(500).send("Failed to create new user.");
  } finally {
    res.redirect("/login");
  }
}

async function handelGetHomePage(req, res) {
  const is_admin = await userModels.isUserAdmin(req.clientObj.Id);
  const is_cheff = await userModels.isUserCheff(req.clientObj.Id);
  req.clientObj.isAdmin = is_admin;
  req.clientObj.isCheff = is_cheff;
  if (req.clientObj.isCheff=== true){
    res.render("homeCheff.ejs", { menu: menu, clientObj: req.clientObj });
  }
  else{
    res.render("home.ejs", { menu: menu, clientObj: req.clientObj });
  }
}

async function handelLogin(req, res) {
  res.render("login.ejs");
}

async function handelSignup(req, res) {
  res.render("signup.ejs");
}


export { handelCreateNewUser, handelGetHomePage, handelLogin, handelSignup };
