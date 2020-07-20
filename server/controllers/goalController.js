const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Goal = require('../models/goalModel');

// get all goals for a user
router.get('/teams/:team_id/users/:member_id', function (req, res) {

    // TODO parameter checking
    Goal.getAllGoalsForUser(req.query.date, req.params.member_id, req.params.team_id)
    .then( (goals) => {

        // TODO result checking
        res.status(200).json(goals)
    })
    .catch( (err)=>{
        console.log(err);
        res.status(500).json({"Error": err.message});
    })


})


module.exports = router;