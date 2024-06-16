const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY || "secret123";

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretKey);
        req.student = decoded.student;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });        
    }

}

module.exports = {
    verifyJWT
};