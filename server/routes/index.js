const router = (module.exports = require("express").Router());
const jwt = require("jsonwebtoken");

router.use("/auth", require("../controllers/authController"));
const jwtKey = "my_secret_key";

// all other routes are protected, so just check for JWT here and reject right away
router.use("/", async function (req, res, next) {
  let validToken = false;
  let user_info = {};
  let token = req.headers["authorization"] || req.headers.cookie;

  if (token) {
    try {
      if (token.indexOf("token=") !== -1) {
        // we got the cookie
        token = token.slice(6, token.length);
      } else {
        // strip "Bearer " from string
        token = token.slice(7, token.length);
      }

      // this throws if not valid
      user_info = await jwt.verify(token, jwtKey);
      if (user_info) {
        validToken = true;
      }
    } catch (err) {
      console.log(err);
      validToken = false;
    }
  }
  if (!validToken) {
    res.status(401).json({ Error: "Missing or invalid JWT." });
  } else {
    next();
  }
});

router.use("/users", require("../controllers/userController.js"));
router.use("/teams", require("../controllers/teamController"));
router.use("/goals", require("../controllers/goalController"));
