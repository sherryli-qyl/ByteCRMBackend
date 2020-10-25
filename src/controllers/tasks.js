const Task = require('../models/task');
const User = require('../models/user');

async function addTask(req, res) { 
	const { relatedTo, type, description, time, date, typeTask, priority, assignedTo,createdBy} = req.body;
	const user = await User.findById(assignedTo).exec();
	const task = new Task({
		relatedTo,
		type,
		description,
		time, 
		date, 
		typeTask,
		priority, 
		createdBy,
	});
	task.user = user;
	for (let i in assignedTo){
		addAssignedToUser(assignedTo[i],task._id);
		task.assignedTo.addToSet(assignedTo[i]);
	}
	await task.save();
	const resTask = await Task.findOne({_id:task._id})
	.populate('assignedToUser', 'firstName lastName fullName')
	.exec();

	return res.json(resTask);
}



async function getTasksByContactId(req, res) { 
	const { id } = req.params;
	const tasks = await Task.find({relatedTo:id})
	.populate('assignedTo', 'firstName lastName fullName')
	.populate('createdBy', 'firstName lastName fullName')
	.exec();
	return res.status(200).json(tasks);
}

async function getAllTasks(req, res) { 
	const { page = 1, pageSize = 10, q = '', fields } = req.query;
    const limit = Math.max(pageSize * 1, 10);
    const skip = (Math.max(page * 1, 1) - 1) * limit;
    const tasks = await Task.find().limit(limit).skip(skip).exec();
    return res.status(200).json(tasks);
}

async function updateTask(req, res) { 
	const { id } = req.params;
	const { date, time, description, typeTask, priority} = req.body;
	const newTask = await Task.findByIdAndUpdate(
		id,
		{ date, time, description, typeTask, priority},
	).exec();
	if (!newTask) {
		return res.status(404).json('tasks not found');
	}
	return res.status(202).json(newTask);
}

async function deleteTask(req, res) { 
	const { id } = req.params;
  const task = await Task.findByIdAndDelete(id).exec();
	if (!task){
		return res.status(404).json('task not found');
	}
	await User.updateMany(
		{ createTasks: task._id },
		{
			$pull: {
					createTasks: task._id 
			}
		}
	).exec();
	return res.sendStatus(204);
}

async function addAssignedToUser(userId, taskId) {
	const user = await User.findById(userId).exec();
	if(!user){
		return res.status(404).json('users not exist');
	}
	user.createTasks.addToSet(taskId);
	await user.save();
}

async function updateAssignedToUser(req, res){
	const {userId, taskId} = req.params;
	const user = await User.findById(userId).exec();
	const task = await Task.findById(taskId).exec();
	if(!user || !task){
		return res.status(404).json('users or task not exist');
	}
	user.tasks.addToSet(taskId);
	task.assignedTo.addToSet(userId);
	await user.save();
	await task.save();
	return res.status(200).json(user);
}

async function removeAssignedToUser(req,res){
	const {userId,taskId} = req.params;
	const user = await User.findById(userId).exec();
	const task = await Task.findById(taskId).exec();
	if (!user || !task) {
			const errorMessage = res.status(404).json('user or task not exist');
			return errorMessage;
	}
	user.tasks.pull(taskId);
	task.assignedTo.pull(userId);
	if (task.assignedTo.length === 0){
			await Task.findByIdAndDelete(task._id);
			await user.save();
			return res.status(200).json("task has been deleted");			
	}
	else{
			await task.save();
			await user.save();
			return res.status(200).json(user);
	} 
}

module.exports = {
	addTask,
	getTasksByContactId,
	getAllTasks,
	updateTask,
	deleteTask,
	updateAssignedToUser,
	removeAssignedToUser,
	

}