var Mongoose = require('../../database').Mongoose

var ObjectId = Mongoose.Schema.Types.ObjectId;

var sessionSchema = new Mongoose.Schema({
  session: {
    type : String,
    required: true
  },
  user: {
    type : ObjectId,
    ref: 'User'
  },
  addedDate: {
    type : Date,
    default: Date.now
  }
})

exports.Session = Mongoose.model('Session', sessionSchema)
