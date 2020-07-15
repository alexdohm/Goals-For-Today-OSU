const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Helpers = require('../handlers/helpers');
const User = require('../models/userModel');


const MISSING_ATTRIBUTE_TEXT = "The request object is missing at least one of the required attributes";

let failedResponseMatch = new Map();
failedResponseMatch.set('400', "The request object is missing at least one of the required attributes");
failedResponseMatch.set('403', "Provided email address is already registered");
failedResponseMatch.set('404', "No user found");


router.get('/:email', function (req, res) {
    
    User.getUserByEmail (req.params.email)
    .then( (result) => {
        console.log(result)
        if (failedResponseMatch.get(result)) {
            res.status(Number(result)).json({"Error": `${failedResponseMatch.get(result)}`});
        }
        else {
            result.self = Helpers.addSelf(req, result.member_id, 'users', result);
            res.status(200).json(result);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ "Error": err.message }).end();
    })
});


// add a user
router.post('/', async function (req, res) {
    if (req.body.first_name && req.body.last_name && req.body.email && req.body.password) {
        User.addUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password)
        .then( (newUser) => {
            console.log(newUser)  
            
            if (failedResponseMatch.get(result)) {
                res.status(Number(result)).json({"Error": `${failedResponseMatch.get(result)}`});
            }
            else {
                newUser.self = Helpers.addSelf(req, newUser.member_id, 'users');
                res.status(201).json(newUser);
            }
        })
        .catch((err)=>{
            // database throws an error because of constraint and populates which one is violated.
            // Catch it and send proper response status & message
            if (err.constraint) {
                res.status(403).json({"Error": `${failedResponseMatch.get('403')}`});
            } else {
                res.status(500).json({"Error": err.message});
            }
            
        })
    } else {
        res.status(400)
            .json({ "Error": MISSING_ATTRIBUTE_TEXT })
            .end();
    }
});

module.exports = router;