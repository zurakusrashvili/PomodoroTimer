const TimerState = require('../models/timerstate');

exports.getTimerStateByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const timerState = await TimerState.findOne({ where: { userId: userId } });
    
    if (!timerState) {
      return res.status(404).json({ message: 'No timer state found for the user.' });
    }
    
    return res.status(200).json(timerState);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.saveOrUpdateTimerState = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      timerType,
      taskId,
      secondsRemaining
    } = req.body;

    let timerState = await TimerState.findOne({ where: { userId: userId } });

    if (timerState) {
      timerState.timerType = timerType;
      timerState.taskId = taskId;
      timerState.secondsRemaining = secondsRemaining;
      await timerState.save();
      return res.status(200).json(timerState);
    } else {
      timerState = await TimerState.create({
        userId: userId,
        timerType: timerType,
        taskId: taskId,
        secondsRemaining: secondsRemaining
      });
      return res.status(201).json(timerState);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
