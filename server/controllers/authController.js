const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");


/* !!!!!!!!!!! WORK IN PROGRESS !!!!!!!!!!! */

passport.use(new LocalStrategy((email, password, cb) => {
   
    User.getUserByEmail(email)
    .then( (user)=> {
        //User.getUserEmailAndPass
    })




/*

    db.query('SELECT id, username, password, type FROM users WHERE username=$1', [username], (err, result) => {
      if(err) {
        winston.error('Error when selecting user on login', err)
        return cb(err)
      }
  
      if(result.rows.length > 0) {
        const first = result.rows[0]
        bcrypt.compare(password, first.password, function(err, res) {
          if(res) {
            cb(null, { id: first.id, username: first.username, type: first.type })
           } else {
            cb(null, false)
           }
         })
       } else {
         cb(null, false)
       }
    })*/
  }))


  
passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  
passport.deserializeUser((id, cb) => {

    User.getUserById(id)
        .then((results) => {
            cb(null, results)
        })
});

// login

router.get('/user/login', function (req, res) {
    
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




// log out
//TODO: implement


module.exports = router;