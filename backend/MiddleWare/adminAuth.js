const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {

    // console.log("Headers:", req.headers);

    let head = req.headers.authorization;

    if (!head) {
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    let token = head.split(" ")[1];

    // console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            message: "JWT missing after Bearer"
        });
    }

    try {
        let decoded = jwt.verify(token, process.env.JWTKEY);

        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Admin access only"
            });
        }

        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Authentication failed: " + err.message
        });
    }
}

module.exports = isAdmin;