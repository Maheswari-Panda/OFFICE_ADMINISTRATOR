var jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../Backend/.env.local' });


const JWT_ACCESS_SECRET_KEY=process.env.JWT_ACCESS_SECRET_KEY;
// const JWT_ACCESS_TOKEN_EXPIRE_TIME=process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME;
// const JWT_REFRESH_SECRET_KEY=process.env.JWT_REFRESH_SECRET_KEY;
// const JWT_REFRESH_TOKEN_EXPIRE_TIME=process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME;

const fetchUser = (req, res, next) => {
    // Get the user from the JWT token and set the user data in the request object
    const token = req.header('accessToken');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_ACCESS_SECRET_KEY);
        req.user = data.user; // Store user data in req.user
        next();
    }
    catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchUser;
