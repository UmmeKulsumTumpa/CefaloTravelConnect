import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret');
        req.user = decoded; // Attach user to req (consider typing this properly)
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
};
//# sourceMappingURL=auth.middleware.js.map