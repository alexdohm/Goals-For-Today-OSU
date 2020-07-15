const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");

const jwt = require("jsonwebtoken");

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 300;

/* !!!!!!!!!!! WORK IN PROGRESS !!!!!!!!!!! */

// passport.use(
//   new LocalStrategy((email, password, cb) => {
//     User.getUserByEmail(email).then((user) => {
//       //User.getUserEmailAndPass
//     });
//
//     /*
//
//     db.query('SELECT id, username, password, type FROM users WHERE username=$1', [username], (err, result) => {
//       if(err) {
//         winston.error('Error when selecting user on login', err)
//         return cb(err)
//       }
//
//       if(result.rows.length > 0) {
//         const first = result.rows[0]
//         bcrypt.compare(password, first.password, function(err, res) {
//           if(res) {
//             cb(null, { id: first.id, username: first.username, type: first.type })
//            } else {
//             cb(null, false)
//            }
//          })
//        } else {
//          cb(null, false)
//        }
//     })*/
//   })
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.getUserById(id).then((results) => {
    cb(null, results);
  });
});

// login
const users = {
  "alexdohm11@gmail.com": "goalsfortoday10",
  user2: "password2",
};

router.post("/login", function (req, res) {
  console.log(req.body);
  const { username, password } = req.body;
  if (!username || !password || users[username] !== password) {
    // return 401 error is username or password doesn't exist, or if password does
    // not match the password in our records
    return res.status(401).end();
  }

  User.getUser(username, password)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).end();
    });

  //TODO: get the response from the database and put it into payload
  const token = jwt.sign({ username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  });
  console.log("token:", token);

  // set the cookie as the token string, with a similar max age as the token
  // here, the max age is in milliseconds, so we multiply by 1000
  //TODO: i dont really understand the role of cookies here,
  // maybe you can give some insight here kelly, maybe we just dont use it for this project, would complicate
  // https://dev.to/mr_cea/remaining-stateless-jwt-cookies-in-node-js-3lle
  // res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
  res.send(token);
  res.end();

  /*  User.getUserByEmail (req.params.email)
    .then( (result) => {
        console.log(result)
        if (failedResponseMatch.get(result)) {
            res.status(Number(result)).json({"Error": `${failedResponseMatch.get(result)}`});
        }
        else {
            result.self = Helpers.addSelf(req, result.member_id, 'users', result);

            //TODO: send verification email at some point .. should do in model maybe
            res.status(200).json(result);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ "Error": err.message }).end();
    })
    */
});

module.exports = router;
