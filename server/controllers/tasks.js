const Task = require('../models/tasks');

exports.getUserTasks = async (req, res, next) => {
  try {
    const ALL_TASKS = await Task.findAll({ where: { userId: req.user.id } });
    return res.status(200).json(ALL_TASKS);
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.addTask = async (req, res, next) => {
  try {
    const TASK_MODEL = {
      description: req.body.description,
      sessions: req.body.sessions,
      completedSessions: req.body.completedSessions,
      userId: req.user.id 
    };

    try {
      const task = await Task.create(TASK_MODEL);
      console.log('Task created');
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const TASK_MODEL = {
      description: req.body.description,
      sessions: req.body.sessions,
      completedSessions: req.body.completedSessions
    };

    try {
      const task = await Task.update(TASK_MODEL, { where: { id: req.params.id } });
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.destroy({ where: { id: req.params.id } });
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json(error);
  }
};
