const express = require('express');

const { 
  addTask,
	getTasksByUserId,
	getAllTasks,
	updateTask,
	deleteTask,
	updateAssignedToUser,
	removeAssignedToUser
  
} = require('../controllers/tasks');

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTasksByUserId);
router.post('/', addTask);
router.put('/:id', updateTask);
router.put('/:taskId/assignedToUser/:userId', updateAssignedToUser);
router.delete('/:id', deleteTask);
router.delete('/:taskId/assignedToUser/:userId', removeAssignedToUser);


module.exports = router;
