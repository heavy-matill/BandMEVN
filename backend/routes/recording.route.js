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

recordingRoute.route('/').get((req, res, next) => {
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

recordingRoute.route('/edit-recording/:id').get((req, res, next) => {
  RecordingModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Add file
recordingRoute.route('/add-recording/').post((req, res, next) => {
  req.body.url;
  req.body.file;

  let name = req.body.file.split('_').slice(0, 3).join('_')

  let date = req.body.file.split('_')[0]
  let hours_type = req.body.file.split('_')[1]
  let hours = hours_type.slice(0, 6);
  let type = hours_type.slice(6) || "Rehearsal";

  let title = req.body.file.split('_')[2]
  let instrument = req.body.file.split('_').slice(3).join('_').split('.').slice(0, -1).join('.')

  let time = new Date(`${date} ${hours.slice(0, 2)}:${hours.slice(2, 4)}:${hours.slice(2, 4)}`)
  let query =
    { name: name }
  let dataToBeUpdated = { title: instrument, url: req.body.url, file: req.body.file }
  //console.log(dataToBeUpdated)
  var bulk = RecordingModel.collection.initializeOrderedBulkOp();
  bulk.find(query).upsert().updateOne({ "$setOnInsert": { name: name, time: time, title: title, type: type, channels: [dataToBeUpdated] } });
  bulk.find({ ...query, "channels.title": { "$ne": instrument } }).updateOne({
    "$push": {
      channels: {//dataToBeUpdated
        "$each": [dataToBeUpdated],
        "$sort": { title: 1 }
      }
    }
  });
  bulk.find({ ...query, "channels.title": instrument }).updateOne({
    "$set":
    Object.fromEntries(
      Object.entries(dataToBeUpdated).map(
        ([k, v], i) => ["channels.$."+k, v]
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
  var bulk = RecordingModel.collection.initializeOrderedBulkOp();
  for (const update of updates) {
    bulk.find({ _id: 
      mongoose.Types.ObjectId(id), "channels.title": update.title }).upsert().updateOne({
      "$set":
      Object.fromEntries(
        Object.entries(update).map(
          ([k, v], i) => ["channels.$."+k, v]
        )
      )
       // { "channels.$": update }
    });
    console.log(update)
    //RecordingModel.findOneAndUpdate({ _id: id, "channels.title": update.title }, { $set: { "channels.$": update } })
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
