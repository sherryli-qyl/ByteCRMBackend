const express = require('express');

const { 
  addTask,
	getTasksByContactId,
	getAllTasks,
	updateTask,
	deleteTask,
	updateAssignedUser,
	removeAssignedToUser,
	getTasksByMultiContacts,
  
} = require('../controllers/tasks');

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTasksByContactId);
router.get('/contacts/:ids',getTasksByMultiContacts);
router.post('/', addTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:taskId/assignedToUser/:userId', updateAssignedUser);
router.delete('/:taskId/assignedToUser/:userId', removeAssignedToUser);


module.exports = router;
