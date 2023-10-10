const controller = require('../controllers/users');
const router = require('express').Router();

router
  .post('/login', controller.login)
  .post('/register', controller.register)
  .get('/logout', controller.logout)
  .get('/', controller.getAll)

module.exports = router;
