import jwt from 'jsonwebtoken';
async function verifyJWT(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        console.log('No token provided.');
        res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.clientObj = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.redirect('/login');
    }
}
export { verifyJWT };