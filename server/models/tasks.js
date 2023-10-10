const Sequelize = require('sequelize');
const db = require('../util/database');
const User = require('./users');

const Task = db.define('tasks', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  completedSessions: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sessions: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;
