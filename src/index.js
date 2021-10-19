//const db = require('./services/database');
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

io.on('connection', async (socket) => {
	const token = socket.handshake.headers.authorization;
	const tokenData = jwt.decode(token, process.env.SECRET);

	const userData = {
		user_id: tokenData.user_id,
	};

	socket.user = userData;
	users[socket.id] = socket;

	// sends unread notifications to user
	socket.on('get_unread', (data) => {
		try {
			// get talking with user sockets
			const userSockets = Object.values(users).filter(
				(u) => u.user.user_id == data.user_id
			);

			// get unread list
			const uread = notificationApp.getUnread._invoke();

			userSockets.forEach((s) => {
				s.emit('unread_notifications', uread);
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
});
