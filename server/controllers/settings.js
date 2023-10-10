const sequelize = require('sequelize');
const Setting = require('../models/settings');

exports.getUserSettings = async (req, res, next) => {
  try {
    const setting = await Setting.findOne({ where: { userId: req.user.id } });
    return res.status(200).json(setting);
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.initialise = async (req, res, next) => {
  const {
    workSessionDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
    autoStartBreak,
    autoStartWorkSession,
    tickingSoundOn,
    alarmSoundOn
  } = req.body;

  try {
    const SETTING_MODEL = {
      workSessionDuration,
      shortBreakDuration,
      longBreakDuration,
      sessionsBeforeLongBreak,
      autoStartBreak,
      autoStartWorkSession,
      tickingSoundOn,
      alarmSoundOn,
      userId: req.user.id
    };

    const setting = await Setting.create(SETTING_MODEL);
    console.log('Setting created');
    return res.status(201).json(setting);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateUserSettings = async (req, res, next) => {
  const {
    workSessionDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
    autoStartBreak,
    autoStartWorkSession,
    tickingSoundOn,
    alarmSoundOn
  } = req.body;

  try {
    const SETTING_MODEL = {
      workSessionDuration,
      shortBreakDuration,
      longBreakDuration,
      sessionsBeforeLongBreak,
      autoStartBreak,
      autoStartWorkSession,
      tickingSoundOn,
      alarmSoundOn
    };

    const setting = await Setting.update(SETTING_MODEL, { where: { id: req.body.id } });
    return res.status(200).json(setting);
  } catch (error) {
    return res.status(500).json(error);
  }
};


// exports.deleteOne = async (req, res, next) => {
//   try {
//     const task = await Setting.destroy({ where: { id: req.params.id } });
//     return res.status(200).json(task);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
