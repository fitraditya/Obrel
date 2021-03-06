var Bcrypt = require('bcryptjs')
var Mongoose = require('../../database').Mongoose

var ObjectId = Mongoose.Schema.Types.ObjectId;

var userSchema = new Mongoose.Schema({
  username: {
    type : String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w][\w\-\.]*[\w]$/i
  },
  password: {
    type : String,
    required: true,
    trim: true
  },
  email: {
    type : String,
    required: true,
    unique: true,
    trim: true
  },
  token: {
    type : String,
    required: false,
    trim: true
  },
  registeredDate: {
    type : Date,
    default: Date.now
  },
  channels: [{
		type: ObjectId,
		ref: 'Channel'
	}]
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
