
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI)
let db = mongoose.connection
//db.collection('recordings').update({'tracks.title': 'bass'},{$set: {'tracks.$.title': 'Bass'}})
//db.collection('recordings').update({'tracks.title': 'drums'},{$set: {'tracks.$.title': 'Drums'}})