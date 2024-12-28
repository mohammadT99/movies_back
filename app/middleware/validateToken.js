const jwt = require("jsonwebtoken");

const validationToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error: JWT secret is not defined.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid token.",
        });
      }
      req.user = user; // Attach user information to the request object
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    return res.status(401).json({
      success: false,
      message:
        "Authorization token is not provided or is in an invalid format.",
    });
  }
};

module.exports = { validationToken };
