const controller = require('../controllers/timerstate');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = require('express').Router();

router.use(authenticateJWT)

router
  .get('/getTimerStateByUser', controller.getTimerStateByUser)
  .post('/saveOrUpdateTimerState', controller.saveOrUpdateTimerState)



module.exports = router;
