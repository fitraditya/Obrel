var Mongoose = require('mongoose')
var db = Mongoose.connection

Mongoose.connect('mongodb://localhost/obrel')

db.on('error', console.error.bind(console, '>> Error connecting to database'))

db.once('open', function callback() {
  console.log('>> Connected to database')
})

exports.Mongoose = Mongoose
