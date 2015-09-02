var Mongoose = require('../../database').Mongoose

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
