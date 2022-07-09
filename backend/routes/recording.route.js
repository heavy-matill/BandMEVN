const express = require('express')
const Recording = require('../models/Recording')
const recordingRoute = express.Router()
var mongoose = require('mongoose');

// model
let RecordingModel = require('../models/Recording')

recordingRoute.route('/create-recording').post((req, res, next) => {
  console.log(req.body.author)
  RecordingModel.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

recordingRoute.route('').get((req, res, next) => {
  RecordingModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

recordingRoute.route('/by-id/:id').get((req, res, next) => {
  RecordingModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

recordingRoute.route('/edit-recording/:id').post((req, res, next) => {
  RecordingModel.findByIdAndUpdate(req.params.id, req.body.update, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Add file
recordingRoute.route('/add-recording-by-filename').post((req, res, next) => {
  //let name = req.body.filename.split('_').slice(0, 3).join('_')

  let date = req.body.filename.split('_')[0]
  let hours_type = req.body.filename.split('_')[1]
  let hours = hours_type.slice(0, 6);
  let type = hours_type.slice(6) || "Rehearsal";

  let title = req.body.filename.split('_')[2]
  let channel = req.body.filename.split('_').slice(3).join('_').split('.').slice(0, -1).join('.')

  let time = new Date(`${date} ${hours.slice(0, 2)}:${hours.slice(2, 4)}:${hours.slice(2, 4)}`)
  let query =
    { time: time }
  let dataToBeUpdated = { title: channel, url: req.body.url, filename: req.body.filename }
  //console.log(dataToBeUpdated)
  var bulk = RecordingModel.collection.initializeOrderedBulkOp();
  bulk.find(query).upsert().updateOne({ "$setOnInsert": { time: time, title: title, type: type, tracks: [dataToBeUpdated] } });
  bulk.find({ ...query, "tracks.title": { "$ne": channel } }).updateOne({
    "$push": {
      tracks: {//dataToBeUpdated
        "$each": [dataToBeUpdated],
        "$sort": { title: 1 }
      }
    }
  });
  bulk.find({ ...query, "tracks.title": channel }).updateOne({
    "$set":
      Object.fromEntries(
        Object.entries(dataToBeUpdated).map(
          ([k, v], i) => ["tracks.$." + k, v]
        )
      )
  });

  bulk.execute(function (err, result) {
    if (err)
      console.log(err)
    //console.log(result)
    res.json(null)
  });

})
// Add file
recordingRoute.route('/add-recording/').post((req, res, next) => {
  req.body.url;
  req.body.filename;


  let title = req.body.title
  let channel = req.body.channel

  let time = new Date(req.body.date)
  let query =
    { time: time }
  let dataToBeUpdated = { title: channel, url: req.body.url, filename: req.body.filename }
  //console.log(dataToBeUpdated)
  var bulk = RecordingModel.collection.initializeOrderedBulkOp();
  bulk.find(query).upsert().updateOne({ "$setOnInsert": { time: time, title: title, type: req.body.type, tracks: [dataToBeUpdated] } });
  bulk.find({ ...query, "tracks.title": { "$ne": channel } }).updateOne({
    "$push": {
      tracks: {//dataToBeUpdated
        "$each": [dataToBeUpdated],
        "$sort": { title: 1 }
      }
    }
  });
  bulk.find({ ...query, "tracks.title": channel }).updateOne({
    "$set":
      Object.fromEntries(
        Object.entries(dataToBeUpdated).map(
          ([k, v], i) => ["tracks.$." + k, v]
        )
      )
  });

  bulk.execute(function (err, result) {
    if (err)
      console.log(err)
    //console.log(result)
    res.json(null)
  });

})
// Add update
recordingRoute.route('/update-recording/:id').post((req, res, next) => {
  let id = req.params.id
  let updates = req.body
  console.log(updates)
  var bulk = RecordingModel.collection.initializeOrderedBulkOp();
  for (const update of updates) {
    bulk.find({
      _id:
        mongoose.Types.ObjectId(id), "tracks.title": update.title
    }).upsert().updateOne({
      "$set":
        Object.fromEntries(
          Object.entries(update).map(
            ([k, v], i) => ["tracks.$." + k, v]
          )
        )
      // { "tracks.$": update }
    });
    console.log(update)
    //RecordingModel.findOneAndUpdate({ _id: id, "tracks.title": update.title }, { $set: { "tracks.$": update } })
  }
  bulk.execute(function (err, result) {
    if (err)
      console.log(err)
    //console.log(result)
    res.json(null)
  });
})

// Update
/*recordingRoute.route('/update-recording/:id').put((req, res, next) => {
  RecordingModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
        console.log('Recording successfully updated!')
      }
    },
  )
})*/

// Delete
recordingRoute.route('/delete-recording/:id').delete((req, res, next) => {
  RecordingModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
})

module.exports = recordingRoute
