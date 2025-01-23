var jwt = require('jsonwebtoken');
const JWT_SECRET = 'MyStringfor$ignature'

const fetchUser = (req, res, next) => {
    // Get the user from the JWT token and set the user data in the request object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; // Store user data in req.user instead of req.admin
        next();
    }
    catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchUser;
