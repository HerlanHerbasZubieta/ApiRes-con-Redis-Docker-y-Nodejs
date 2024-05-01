const bcrypt = require('bcryptjs');

async function hashPassword(password){
    return await bcrypt.hash(password, 10);
}

async function comparePassword(passwordPlano, passwordHasheado){
    return await bcrypt.compare(passwordPlano, passwordHasheado);
}

module.exports = {
    hashPassword,
    comparePassword
};