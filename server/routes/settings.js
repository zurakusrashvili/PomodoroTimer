const controller = require('../controllers/settings');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = require('express').Router();

router.use(authenticateJWT)

router
  .get('/getUserSettings', controller.getUserSettings)
  .put('/updateUserSettings', controller.updateUserSettings)
  .post('/initialise', controller.initialise)


module.exports = router;