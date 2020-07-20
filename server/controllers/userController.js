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

// get user by email or member id
router.get('/:identifier', function (req, res) {
    if (req.query.type === "id") {
        User.getUserById (req.params.identifier)
        .then( (result) => {
            //console.log(result)
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
    } else if (req.query.type === "email") {
        User.getUserByEmail (req.params.identifier)
        .then( (result) => {
            //console.log(result)
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
    }
    
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


// PATCH modify a user
router.patch("/:user_id", async function (req, res) {
    if (req.body.firstName
        || req.body.lastName
        || req.body.email
        || req.body.password
        || req.body.morning_time
        || req.body.evening_time
        || req.body.time_zone
        || req.body.verified) {
        User.updateUser(req.params.user_id, req.body)
        .then((u) => {
            if (failedResponseMatch.get(u)) {
                res.status(Number(u)).json({ "Error": `${failedResponseMatch.get(u)}` });
            }
            else {

                u.self = Helpers.addSelf(req, req.params.user_id, 'users')
                delete u.member_password;
                res.status(200).json(u).end();   
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err.message);
        })
    }
    else {
        res.status(400)
            .json({ "Error": MISSING_ATTRIBUTE_TEXT})
            .end();
    }
});


// get all teams for a user
router.get('/:user_id/teams', function (req, res) {
    
    User.getAllTeamsForUser (req.params.user_id)
    .then( (result) => {
        console.log(result)
        if (failedResponseMatch.get(result)) {
            res.status(Number(result)).json({"Error": `${failedResponseMatch.get(result)}`});
        }
        else {
            result.items = Helpers.addSelf(req, result.items, 'teams', result);
            res.status(200).json(result);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ "Error": err.message }).end();
    })
});

module.exports = router;