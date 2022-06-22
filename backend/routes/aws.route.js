const express = require('express')
const awsRoute = express.Router()
const AWSUtils = require('../utils/AWSUtils')


awsRoute.route('/').get((req, res, next) => {
  res.json("this is sub route /aws")
})

awsRoute.route('/sign/:op/:filename(*)').get((req, res, next) => {
  console.log(`Signing ${req.params.op} ${req.params.filename}`);
  AWSUtils.sign(req.params.filename, req.params.op + "Object", (err, data) => {
    if (err) {
      console.log(err);
      res.json()
    } else {
      res.json(data)
    }
  });
})

awsRoute.route('/files/:filename(*)').get((req, res, next) => {
  console.log(`getting file ${req.params.filename}`);
  AWSUtils.sign(req.params.filename, "getObject", (err, data) => {
    if (err) {
      console.log(err);
      res.json()
    } else {
      // permanent reroute to direkt link
      res.redirect(301, data)
    }
  });
})

module.exports = awsRoute
