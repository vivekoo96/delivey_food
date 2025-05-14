const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
function isLoggedIn(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
            const token = authHeader.split(' ')[1]; // Bearer <token>
            // console.log('Extracted Token:', token);
        if (!token) {
            return res.status(401).json({ message: 'Token missing in Authorization header' });
        }
        console.log(jwt.verify(token, SECRET_KEY));
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        
        req.user = decoded; // You now have access to user data in routes
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    // Assuming you decode and store the full user payload in req.user
    console.log(req.user.company);
    
    
    if (req.user && req.user.company && req.user.company.toLowerCase() === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Admin access only' });
    }
}

module.exports = {
    isLoggedIn,
    isAdmin
};
