const Sequelize = require('sequelize');
const db = require('../util/database');
const User = require('./users');

const Setting = db.define('settings', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  workSessionDuration: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 25
  },
  shortBreakDuration: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  longBreakDuration: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 15
  },
  sessionsBeforeLongBreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 4
  },
  autoStartBreak: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  autoStartWorkSession: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tickingSoundOn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  alarmSoundOn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

User.hasOne(Setting, { foreignKey: 'userId' });
Setting.belongsTo(User, { foreignKey: 'userId' });

module.exports = Setting;
