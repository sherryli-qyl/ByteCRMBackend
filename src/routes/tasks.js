const express = require('express');

const { 
  addTask,
	getTasksByContactId,
	getAllTasks,
	updateTask,
	deleteTask,
	updateAssignedUser,
	removeAssignedToUser
  
} = require('../controllers/tasks');

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTasksByContactId);
router.post('/', addTask);
router.put('/:id', updateTask);
router.put('/:taskId/users', updateAssignedUser);
router.delete('/:id', deleteTask);
router.delete('/:taskId/assignedToUser/:userId', removeAssignedToUser);


module.exports = router;
