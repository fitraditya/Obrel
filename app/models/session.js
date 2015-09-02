var Mongoose = require('../../database').Mongoose

var ObjectId = Mongoose.Schema.Types.ObjectId;

var sessionSchema = new Mongoose.Schema({
  session: {
    type : String,
    required: true
  },
  token: {
    type : String, required: true
  },
  addedDate: {
    type : Date,
    default: Date.now
  }
})

exports.Session = Mongoose.model('Session', sessionSchema)
