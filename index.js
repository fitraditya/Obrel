var Hapi = require('hapi')
var SocketIO = require('socket.io')

var server = new Hapi.Server()

server.connection({ port: 9876, labels: ['api'] })

var io = SocketIO.listen(server.listener)

require('./app/controllers/socket.js')(io)

server.start(function () {
  console.log('Server running at:', server.info.uri)
})
