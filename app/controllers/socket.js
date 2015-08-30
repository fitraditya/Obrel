var Authentication = require('./socket/authentication')

module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('>> ' + socket.id + ' has connected.')

    socket.on('sign_up', function (data) {
      Authentication.signup(socket, data)
    })

    socket.on('sign_in', function (data) {
      Authentication.signin(socket, data)
    })

    socket.on('load_channel', function (data) {
      socket.emit('load_channel', { status: 'ok', channels: [] })
    })
  })
}
