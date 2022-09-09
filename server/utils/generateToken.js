const jwt = require('jsonwebtoken');

module.exports = function ( email, _id, role) {
    return jwt.sign(
        {
            email,
            _id,
            role
        },
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}