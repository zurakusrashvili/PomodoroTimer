const express = require('express');
const sequelize = require('./util/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const User = require('./models/users');
const Task = require('./models/tasks');
const Setting = require('./models/settings');
const TimerState = require('./models/timerstate');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowlist = ['http://localhost:8080', 'https://pomodorotimer.webwide.ge'];

app.use(cors({
    origin: function (origin, callback) {
        if (allowlist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/users', require('./routes/users'));
app.use('/tasks', require('./routes/tasks'));
app.use('/timerstate', require('./routes/timerstate'));
app.use('/settings', require('./routes/settings'));

(async () => {
    try {
        await User.sync();
        await Task.sync();
        await Setting.sync();
        await TimerState.sync();

        console.log("Database synced!");

        app.listen(process.env.PORT || 3001, () => {
            console.log(`Server is running on port ${process.env.PORT || 3001}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
