import express from 'express'
import { File } from 'buffer'
import path from 'path'
import {router as userRoters } from './routes/user.js'
import {router as adminRoters } from './routes/admin.js'
import {router as apiRotuers } from './routes/api.js'
import cookieParser from 'cookie-parser';
import { validateAdminRequest } from './middleware/admin/adminValidate.js'
import { verifyJWT } from './middleware/login/verifyJWT.js'
import { assignTable } from './config/activeTables.js'




const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.static(path.resolve("./public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;


app.use('/', userRoters);
app.use('/api',verifyJWT,assignTable,apiRotuers);
app.use('/admin',verifyJWT, assignTable, validateAdminRequest, adminRoters);


app.listen(PORT,() => console.log("Server started, listening on port 3000."));
