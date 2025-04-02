import { usermodel } from "../../DB/models/user.model.js";

export const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Unauthorized: No user found" });
            }
            const user = await User.findById(req.user.id).select('role'); 

            if (!user) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden: You don't have permission" });
            }

            req.user = user;

            next();  
        } catch (error) {
            console.error("Error in checkRole middleware:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
};
