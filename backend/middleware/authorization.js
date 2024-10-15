const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization) {
        res.status(401).json({ message: "Acceso no Autorizado" });
    }
    try {
        let [type, token] = authorization.split(' ');
        if (type === 'Token' || type === "Bearer") {
            const openToken = jwt.verify(token, process.env.SECRET);
            req.user = openToken.user;
            next();

        } else {
            res.status(401).json({ message: "Acceso no Autorizado" });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'ocurrio un error', error })
    }
};


