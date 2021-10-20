const jwt = require('jwt-simple');
//const moment = require('moment');
// const errorHandling = require("./errorHandling");
//const { config } = require('./config');

const { server, app } = require('./server');
const socketio = require('socket.io');
const siofu = require('socketio-file-upload');
const notificationApp = require('./notification/app');

app.use(siofu.router);

const io = socketio(server, {
	pingTimeout: 5000,
	pingInterval: 1000,
	cors: {
		origin: 'http://localhost',
		methods: ['GET', 'POST'],
		allowedHeaders: ['Authorization'],
		credentials: true,
	},
});

const users = [];

// authorization
io.use((socket, next) => {
	if (socket.handshake.headers && socket.handshake.headers.authorization) {
		try {
			const tokenData = jwt.decode(
				socket.handshake.headers.authorization,
				process.env.SECRET
			);

			const userData = {
				user_id: tokenData.user_id,
			};

			socket.user = userData;
			users[socket.id] = socket;
			next();
		} catch (error) {
			next(new Error('Autentication error'));
		}
	} else {
		next(new Error('Autentication error'));
	}
});

io.on('connection', async (socket) => {
	//#region notifications

	// sends all unread notifications to user
	socket.on('get_unread', async (data) => {
		try {
			// get talking with user sockets
			const userSockets = Object.values(users).filter(
				(u) => u.user.user_id == data.user_id
			);

			// get unread list
			const unread = await notificationApp.getUnread._invoke(data.user_id);

			userSockets.forEach((s) => {
				s.emit('unread_notifications', unread);
			});
		} catch (error) {
			console.log(error);
		}
	});

	// sends new notification to user
	socket.on('new_notification', (data) => {
		try {
			// get talking with user sockets
			const userSockets = Object.values(users).filter(
				(u) => u.user.user_id == data.user_id
			);

			userSockets.forEach((s) => {
				s.emit('unread_notifications', data);
			});
		} catch (error) {
			console.log(error);
		}
	});

	// the user reads a notification, mark it as readed
	socket.on('notification_readed', (data) => {
		try {
			// persist on db
			notificationApp.markRead._invoke(data);
		} catch (error) {
			console.log(error);
		}
	});
	//#endregion notifications

	//#region chat
	//#endregion chat

	socket.on('disconnect', async () => {
		try {
			console.log(`socket ${socket.id} disconnected`);
			delete users[socket.id];
			//socket.broadcast.emit('deactivate user', socket.user.id_user);
		} catch (error) {
			console.log(error);
		}
	});
});
