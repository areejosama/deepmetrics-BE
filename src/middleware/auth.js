import jwt from 'jsonwebtoken';
import { usermodel } from '../../DB/models/user.model.js';

export const auth = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { token } = req.headers;
            if (!token || !token.startsWith(process.env.bearerkey)) {
                return res.status(401).json({ message: 'Unauthorized: No token provided or invalid token' });
            }

            let mytoken = token.split(process.env.bearerkey)[1];
            const decoded = await jwt.verify(mytoken, process.env.secretkey);

            if (!decoded || !decoded.id) {
                return res.status(401).json({ message: "Unauthorized: No user found in the token" });
            }
            const user = await usermodel.findById(decoded.id).select('role');

            if (!user) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden: You don't have permission" });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error("Error in authAndCheckRole middleware:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
};


