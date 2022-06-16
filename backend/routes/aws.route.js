const express = require('express')
const awsRoute = express.Router()
const AWSUtils = require('../utils/AWSUtils')


awsRoute.route('/').get((req, res, next) => {
  res.json("this is sub route /aws")
})

awsRoute.route('/sign/:filename').get((req, res, next) => {
  console.log("signing " + req.params.filename);
  AWSUtils.sign(req.params.filename, (err, data) => {
    if (err) {
      console.log(err);
      res.json()
    } else {
      res.json(data)
    }
  });
})

module.exports = awsRoute
