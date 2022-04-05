const express = require('express')
const recordingRoute = express.Router()

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
recordingRoute.route('/add-file/').post((req, res, next) => {
  req.body.url;
  req.body.file;
  console.log(req.body)

  let date = req.body.file.split('_')[0]
  let hours_type = req.body.file.split('_')[1]
  let hours = hours_type.slice(0, 6);
  let type = hours_type.slice(6) || "Rehearsal";

  let title = req.body.file.split('_')[2]
  let instrument = req.body.file.split('_').slice(3).join('_').split('.').slice(0, -1).join('.')

  let time = new Date(`${date} ${hours.slice(0, 2)}:${hours.slice(2, 4)}:${hours.slice(2, 4)}`)
  RecordingModel.findOne(
    { time: time },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        if (data) {
          data.channels.set(instrument, { url: req.body.url, file: req.body.file });
          data.save((error, data) => {
            if (error) {
              return next(error)
            } else {
              res.json(data)
              console.log('Recording successfully updated!')
            }
          })
        } else {
          RecordingModel.create({ time: time, title: title, type: type, channels: { [instrument]: { url: req.body.url, file: req.body.file } } }, (error, data) => {
            if (error) {
              return next(error)
            } else {
              res.json(data)
              console.log('Recording successfully created!')
            }
          })
        }
      }
    })
})
// Add mix-config
recordingRoute.route('/add-mix/').post((req, res, next) => {
  let id = req.body.id
  let tracks = req.body.tracks
  RecordingModel.findOne({ _id: id },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        if (data) {
          for (const track of tracks) {
            data.channels.set(track.title, { ...data.channels[track.title], gain: track.gain, pan: track.pan })
          }
        } else {
          console.log(`Mix not added to invalid id: ${id}`)
          data.save((error, data) => {
            if (error) {
              return next(error)
            } else {
              res.json(data)
              console.log('Mix successfully added!')
            }
          })
        }
      }
    })
})

// Update
recordingRoute.route('/update-recording/:id').put((req, res, next) => {
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
})

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
