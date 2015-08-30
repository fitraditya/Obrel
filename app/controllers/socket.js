var Authentication = require('./socket/authentication')
var Channel = require('./socket/channel')

module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('>> ' + socket.id + ' has connected.')

    socket.on('sign_up', function (data) {
      Authentication.signup(socket, data)
    })

    socket.on('sign_in', function (data) {
      Authentication.signin(socket, data)
    })

    socket.on('create_channel', function (data) {
      Channel.create(socket, data)
    })

    socket.on('load_channel', function (data) {
      Channel.load(socket, data)
    })

    socket.on('join_channel', function (data) {
      Channel.join(socket, data)
    })

    socket.on('invite_user', function (data) {
      Channel.invite(io, socket, data)
    })
  })
}
