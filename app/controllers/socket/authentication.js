var _ = require('lodash')
var Crypto = require('crypto')
var User = require('../../models/user').User

exports.signup = function (socket, data) {
  if (_.isEmpty(data.username) || _.isEmpty(data.password) || _.isEmpty(data.email)) {
    socket.emit('sign_up', { status: 'error', error: 'Username, password, or email can not be empty' })
    return
  }

  else {
    User.findOne({ $or: [{ username: data.username }, { email: data.email }] }, function (error, user) {
      if (error) {
        socket.emit('sign_up', { status: 'error', error: 'Error: ' + error.message })
        console.log ('>> Error: ' . error.message)
        return
      }

      if (user) {
        socket.emit('sign_up', { status: 'error', error: 'Username or email already exists' })
        return
      }

      else {
        var newUser = User({
          username: data.username,
          password: data.password,
          email: data.email,
          token: Crypto.randomBytes(32).toString('hex')
        })

        newUser.save(function (error, user) {
          if (error) {
            socket.emit('sign_up', { status: 'error', error: 'Error: ' + error.message })
            console.log ('>> Error: ' . error.message)
            return
          }

          else {
            socket.emit('sign_up', { status: 'ok', user: { id: socket.id, username: data.username, email: data.email } })
            console.log('>> ' + socket.id + ' signed up as ' + data.username)
            return
          }
        })
      }
    })
  }
}

exports.signin = function (socket, data) {
  if (_.isEmpty(data.email) && _.isEmpty(data.password)) {
    socket.emit('sign_in', { status: 'error', error: 'Invalid email or password' })
    return
  }

  else {
    User.findOne({ email: data.email }, function (error, user) {
      if (error) {
        socket.emit('sign_in', { status: 'error', error: 'Error: ' + error.message })
        console.log ('>> Error: ' . error.message)
        return
      }

      if (user) {
        user.comparePassword(data.password, function (error, match) {
          if (error) {
            socket.emit('sign_in', { status: 'error', error: 'Error: ' + error.message })
            console.log ('>> Error: ' . error.message)
            return
          }

          if (match) {
            socket.emit('sign_in', { status: 'ok', user: { id: socket.id, username: user.username, email: user.email, token: user.token } })
            console.log('>> ' + socket.id + ' signed in as ' + user.username)
            return
          }

          else {
            socket.emit('sign_in', { status: 'error', error: 'Invalid user password' })
            return
          }
        })
      }

      else {
        socket.emit('sign_in', { status: 'error', error: 'Invalid user email' })
        return
      }
    })
  }
}
