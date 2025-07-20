import express from 'express'
import { verifyJWT} from '../middleware/login/verifyJWT.js';
import { validateSignupData } from '../middleware/login/signupValidaer.js';
import { validateLoginData } from '../middleware/login/loginValidator.js';
import { handelGetHome } from '../controllers/kitchen.js';
import { handelCreateNewUser, handelGetHomePage, handelLogin, handelSignup, } from '../controllers/user.js'

const router = express.Router();

// Login routes
router.get('/login',handelLogin);
router.post('/signup',validateSignupData,handelCreateNewUser);
router.post('/login',validateLoginData);
router.get('/signup',handelSignup);


router.get('/',verifyJWT,handelGetHome);

export {router};