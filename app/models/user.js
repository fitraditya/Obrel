var Bcrypt = require('bcryptjs')
var Mongoose = require('../../database').Mongoose

var userSchema = new Mongoose.Schema({
  username: { type : String, required: true },
  password: { type : String, required: true },
  email: { type : String, required: true },
  token: { type : String, default: '_' }
  registrationDate: { type : Date, default: Date.now },
  channels: [Mongoose.Schema.Types.Mixed]
})

userSchema.pre('save', function (next) {
  var user = this

  if (this.isModified('password') || this.isNew) {
    Bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        return next(error)
      }

      Bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) {
          return next(error)
        }

        user.password = hash
        next()
      })
    })
  }

  else {
    return next()
  }
})

userSchema.methods.comparePassword = function (pwd, callback) {
  Bcrypt.compare(pwd, this.password, function (error, isMatch) {
    if (error) {
      return callback(error)
    }

    callback(null, isMatch)
  })
}

exports.User = Mongoose.model('User', userSchema)
