const jwt = require("jsonwebtoken");

const jwtAuthmiddleware = (req, res, next) => {
  // First check request headers has auhtorization or not

  const authorization = req.headers.authorization;

  // console.log("authorization is " + authorization);

  if (!authorization) return res.status(401).json({ error: "Token Not Found" });
  // Extract the jwt token from the request header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: 30000,
    });
    // console.log("decoded is ", decoded); // Fix the typo

    // Attach user info to the request object
    req.user = decoded;
    // console.log("req.user inside middleware:", req.user);

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Function to generate JWT token

const generateToken = (userData) => {
  // Generate new JWT Token using user data

  return jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: 30000 });
};

module.exports = { jwtAuthmiddleware, generateToken };
