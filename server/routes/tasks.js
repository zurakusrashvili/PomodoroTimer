const controller = require('../controllers/tasks');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = require('express').Router();
router.use(authenticateJWT)

router
  .get('/getUserTasks', controller.getUserTasks)
  .get('/:id', controller.getTaskById)
  .post('/add', controller.addTask)
  .put('/update/:id', controller.updateTask)
  .delete('/delete/:id', controller.deleteTask);


module.exports = router;
