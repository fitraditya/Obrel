var _ = require('lodash')
var Crypto = require('crypto')
var User = require('../../models/user').User
var Channel = require('../../models/channel').Channel

var md5sum = Crypto.createHash('md5')

exports.create = function (socket, data) {
  if (_.isEmpty(data.token) || _.isEmpty(data.channel.name) || _.isEmpty(data.channel.type)) {
    socket.emit('create_channel', { status: 'error', error: 'Channel name, type, and token can not be empty' })
    return
  }

  else {
    User.findOne({ token: data.token }, function (error, user) {
      if (error) {
        socket.emit('create_channel', { status: 'error', error: 'Error: ' + error.message })
        console.log ('>> Error: ' . error.message)
        return
      }

      if (user) {
        var newChannel = {
          name: data.channel.name,
          hash: md5sum.update(data.channel.name + (Math.random() * 1000)).digest('hex'),
          type: data.channel.type,
          description: data.channel.description,
          createdBy: user._id
        }

        var channel = new Channel(newChannel)

        channel.save(function (error, result) {
          if (error) {
            socket.emit('create_channel', { status: 'error', error: 'Error: ' + error.message })
            console.log ('>> Error: ' . error.message)
            return
          }

          else {
            User.update({ token: data.token }, { $push: { channels: { name: channel.name, hash: channel.hash, type: channel.type, joinDate: Date.now, edit: true } } }, function(error, result) {
              if (error) {
                socket.emit('create_channel', { status: 'error', error: 'Error: ' + error.message })
                console.log ('>> Error: ' . error.message)
                return
              }

              else {
                socket.emit('create_channel', { status: 'ok', channel: { name: channel.name, hash: channel.hash, type: channel.type } })
                return
              }
            })
          }
        })
      }

      else {
        socket.emit('create_channel', { status: 'error', error: 'Invalid user token' })
        return
      }
    })
  }
}

exports.load = function (socket, data) {
  if (_.isEmpty(data.token)) {
    socket.emit('load_channel', { status: 'error', error: 'Token can not be empty' })
    return
  }

  else {
    User.findOne({ token: data.token }, function (error, user) {
      if (error) {
        socket.emit('load_channel', { status: 'error', error: 'Error: ' + error.message })
        console.log ('>> Error: ' . error.message)
        return
      }

      if (user) {
        socket.emit('load_channel', { status: 'ok', channels: user.channels } )
        return
      }

      else {
        socket.emit('load_channel', { status: 'error', error: 'Invalid user token' })
        return
      }
    })
  }
}

exports.join = function (socket, data) {
  if (_.isEmpty(data.token) || _.isEmpty(data.channel.hash)) {
    socket.emit('join_channel', { status: 'error', error: 'Channel hash and token can not be empty' })
    return
  }

  else {
    User.findOne({ token: data.token }, function (error, user) {
      if (error) {
        socket.emit('join_channel', { status: 'error', error: 'Error: ' + error.message })
        console.log ('>> Error: ' . error.message)
        return
      }

      if (user) {
        Channel.findOne({ hash: data.channel.hash }, function (error, channel) {
          if (error) {
            socket.emit('join_channel', { status: 'error', error: 'Error: ' + error.message })
            console.log ('>> Error: ' . error.message)
            return
          }

          if (channel) {
            User.update({ token: data.token }, { $push: { channels: { name: channel.name, hash: channel.hash, type: channel.type, joinDate: Date.now, edit: true } } }, function (error, user) {
              if (error) {
                socket.emit('join_channel', { status: 'error', error: 'Error: ' + error.message })
                console.log ('>> Error: ' . error.message)
                return
              }

              if (user) {
                socket.emit('join_channel', { status: 'ok' })
                return
              }
            })
          }

          else {
            socket.emit('invite_user', { status: 'error', error: 'Invalid channel hash' })
            return
          }
        })
      }

      else {
        socket.emit('load_channel', { status: 'error', error: 'Invalid user token' })
        return
      }
    })
  }
}

exports.leave = function (socket, data) {
  if (_.isEmpty(data.token) || _.isEmpty(data.channel.hash)) {
    socket.emit('leave_channel', { status: 'error', error: 'Channel hash and token can not be empty' })
    return
  }

  else {
    User.findOne({ token: data.token }, function (error, user) {
      if (error) {
        socket.emit('leave_channel', { status: 'error', error: 'Error: ' + error.message })
        console.log ('>> Error: ' . error.message)
        return
      }

      if (user) {
        Channel.findOne({ hash: data.channel.hash }, function (error, channel) {
          if (error) {
            socket.emit('leave_channel', { status: 'error', error: 'Error: ' + error.message })
            console.log ('>> Error: ' . error.message)
            return
          }

          if (channel) {
            if (channel.createdBy.equals(user._id)) {
              socket.emit('leave_channel', { status: 'error', error: 'You can not leave this channel' })
              return
            }

            else {
              User.update({ token: data.token }, { $pull: { channels: { hash: channel.hash } } }, function (error, user) {
                if (error) {
                  socket.emit('leave_channel', { status: 'error', error: 'Error: ' + error.message })
                  console.log ('>> Error: ' . error.message)
                  return
                }

                if (user) {
                  socket.emit('leave_channel', { status: 'ok' })
                  return
                }
              })
            }
          }

          else {
            socket.emit('invite_user', { status: 'error', error: 'Invalid channel hash' })
            return
          }
        })
      }

      else {
        socket.emit('load_channel', { status: 'error', error: 'Invalid user token' })
        return
      }
    })
  }
}

exports.invite = function (io, socket, data) {
  if (_.isEmpty(data.token) || _.isEmpty(data.user.email) || _.isEmpty(data.channel.hash)) {
    socket.emit('invite_user', { status: 'error', error: 'User email, channel hash, and token can not be empty' })
    return
  }

  else {
    User.findOne({ token: data.token }, function (error, user) {
      if (error) {
        socket.emit('invite_user', { status: 'error', error: 'Error: ' + error.message })
        console.log ('>> Error: ' . error.message)
        return
      }

      if (user) {
        Channel.findOne({ hash: data.channel.hash }, function (error, channel) {
          if (error) {
            socket.emit('invite_user', { status: 'error', error: 'Error: ' + error.message })
            console.log ('>> Error: ' . error.message)
            return
          }

          if (channel) {
            if (channel.type === 'public') {
              User.update({ email: data.user.email }, { $push: { channels: { name: channel.name, hash: channel.hash, type: channel.type, joinDate: Date.now, edit: true } } }, function (error, user) {
                if (error) {
                  socket.emit('invite_user', { status: 'error', error: 'Error: ' + error.message })
                  console.log ('>> Error: ' . error.message)
                  return
                }

                if (user) {
                  socket.emit('invite_user', { status: 'ok' })
                  return
                }
              })
            }

            else {
              if (channel.createdBy.equals(user._id)) {
                User.update({ email: data.user.email }, { $push: { channels: { name: channel.name, hash: channel.hash, type: channel.type, joinDate: Date.now, edit: true } } }, function (error, user) {
                  if (error) {
                    socket.emit('invite_user', { status: 'error', error: 'Error: ' + error.message })
                    console.log ('>> Error: ' . error.message)
                    return
                  }

                  if (user) {
                    socket.emit('invite_user', { status: 'ok' })
                    return
                  }
                })
              }
            }
          }

          else {
            socket.emit('invite_user', { status: 'error', error: 'Invalid channel hash' })
            return
          }
        })
      }

      else {
        socket.emit('load_channel', { status: 'error', error: 'Invalid user token' })
        return
      }
    })
  }
}
