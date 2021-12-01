'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

let users = [];
module.exports = () => {
  const frontendUrl = 'https://portal-ictbitt-frontend.herokuapp.com/';
  // 'http://localhost:3000/redirect';
  const io = require('socket.io')(strapi.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join', async ({ username, room }, callback) => {
      if (users.indexOf(socket.id) == -1) {
        users.push(socket.id);
        callback({ message: 'You are joined !!', users });
      } else {
        callback({ message: 'You are already on the server !!', users });
      }
    });

    socket.on('updateApiCall', async () => {
      socket.broadcast.emit(
        'notification',
        'Someone updated something in server'
      );
    });

    socket.on('disconnect', async () => {
      console.log('disconnect');
      let userIndex = users.indexOf(socket.id);
      users.splice(userIndex, 1);
    });
  });
};
