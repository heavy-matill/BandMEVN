const mongoose = require('mongoose')
const Schema = mongoose.Schema

let recordingSchema = new Schema(
  {
    time: {
      type: Date,
      unique: true,
    },
    date: {
      type: String,
      default: function () {
        console.log(this)
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
    channels: {
      type: Map,
      of:
      {
        url: String,
        file: String,
        pan: Number,
        gain: Number
      },
    },
    instruments: {
      type: String,
      default: function () {
        return instrumentsFromChannels(this.channels)
      }
    },
  },
  {
    collection: 'recordings',
  },
)

function instrumentsFromChannels(channels) {
  return Array.from(channels.keys()).join(', ')
}

recordingSchema.pre('save', function (next) {
  this.instruments = instrumentsFromChannels(this.channels)
  next();
});
module.exports = mongoose.model('Recording', recordingSchema)
