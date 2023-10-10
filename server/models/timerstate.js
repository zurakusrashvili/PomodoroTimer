const Sequelize = require('sequelize');
const db = require('../util/database');
const User = require('./users');
const Task = require('./tasks');

const TimerState = db.define('timerState', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: { 
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  taskId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  timerType: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  secondsRemaining: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

User.hasOne(TimerState, { foreignKey: 'userId' });
Task.hasOne(TimerState, { foreignKey: 'taskId' });

TimerState.belongsTo(User, { foreignKey: 'userId' });
TimerState.belongsTo(Task, { foreignKey: 'taskId' });

module.exports = TimerState;
