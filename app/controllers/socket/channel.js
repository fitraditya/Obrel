var _ = require('lodash')
var Crypto = require('crypto')
var User = require('../../models/user').User
var Channel = require('../../models/channel').Channel

var md5sum = Crypto.createHash('md5')

exports.create = function (socket, data) {
  if (_.isEmpty(data.channel.name) || _.isEmpty(data.channel.name)) {
    socket.emit('create_channel', { status: 'error', error: 'Channel name and type can not be empty' })
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
