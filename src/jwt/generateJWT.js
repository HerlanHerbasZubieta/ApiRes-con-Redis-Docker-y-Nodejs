const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY || "secret123";

function generateJWT(student){
    const token = jwt.sign(
        { student },
        secretKey,
        { expiresIn: '1h'}
    );
    return token;
}

module.exports = {
    generateJWT
};