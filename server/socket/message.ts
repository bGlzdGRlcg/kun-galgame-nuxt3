import { defineIOHandler } from '../../modules/socket/runtime/helpers'

export default defineIOHandler((io) => {
  io.on('connection', (socket) => {
    console.log('Socket.io connect successfully')
  })
})
