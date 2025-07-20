
function logger(req, res, next) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress; 

    //console.log(`[${timestamp}] ${ip} ${method} ${url}`);

    next();
}

export { logger };
