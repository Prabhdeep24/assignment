const jwt = require("jsonwebtoken");
const jwtSecret = "secret";

const authService = () => {
  const issue = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
  };

  return {
    issue,
  };
};

module.exports = authService;
