const mongoose = require('mongoose')
const Schema = mongoose.Schema

let trackSchema = new Schema({
  title: String,
  url: String,
  filename: String,
  pan: Number,
  gain: Number
});
let recordingSchema = new Schema(
  {
    time: Date,
    date: {
      type: String,
      default: function () {
        return this.time.toISOString().split('T')[0];
      }
    },
    time_hhmm: {
      type: String,
      default: function () {
        return this.time.toISOString().split('T')[1].slice(0, 5);
      }
    },
    title: String,
    type: String,
    tracks: [trackSchema],
    channels: {
      type: String,
      default: function () {
        return channelsFromTracks(this.tracks)
      }
    },
  },
  {
    collection: 'recordings',
  },
)

function channelsFromTracks(tracks) {
  return tracks.map(function (track) { return track.title; }).join(', ')
}

recordingSchema.pre('save', function (next) {
  this.channels = channelsFromTracks(this.tracks)
  next();
});
module.exports = mongoose.model('Recording', recordingSchema)
