const mongoose = require('mongoose')
const Schema = mongoose.Schema

let channelSchema = new Schema({
  title: String,
  url: String,
  file: String,
  pan: Number,
  gain: Number
});
let recordingSchema = new Schema(
  {
    name: { type: String, unique: true },
    time: {
      type: Date,
      unique: true,
    },
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
    channels: [channelSchema],
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
  return channels.map(function (channel) { return channel.title; }).join(', ')
}

recordingSchema.pre('save', function (next) {
  this.instruments = instrumentsFromChannels(this.channels)
  next();
});
module.exports = mongoose.model('Recording', recordingSchema)
