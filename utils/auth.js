const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('secret');


module.exports = function (req, res, next){
    //get token from header
    const token = req.header('x-auth-token');

    //if no token
    if (!token){
        return res.status(401).send('Invalid Token, auth denied');
    }

    //verify token
    try {
        const decoded = jwt.verify(token, secret);

        req.user = decoded.user;
        next();

    } catch(err){
        res.status(401).json({message: err})
    }
}


