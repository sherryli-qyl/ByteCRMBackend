const Task = require('../models/task');
const User = require('../models/user');
const {checkDuplicateItem} = require('../utils/sortArray');

async function addTask(req, res) { 
	const { relatedTo, type, description, time, date, taskType, priority, users,createdBy,name,status} = req.body;
	const task = new Task({
		relatedTo,
		name,
		type,
		description,
		time, 
		date, 
		taskType,
		priority, 
		createdBy,
		status,
	});
	
	for (let i in users){		
		addAssignedToUser(users[i],task._id)
		task.users.addToSet(users[i]);
	}

	await task.save();
	const resTask = await Task.findOne({_id:task._id})
	.populate('users', 'firstName lastName email fullName')
	.exec();
	return res.json(resTask);
}



async function getTasksByContactId(req, res) { 
	const { id } = req.params;
	const tasks = await Task.find({relatedTo:id})
	.populate('users', 'firstName lastName fullName email')
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

async function getTasksByMultiContacts(req, res) {
    const { ids } = req.params;
    const relatedIds = ids.split("&&");
    let allTasks = [];
    console.log(relatedIds);
    for (i in relatedIds) {
        const tasks = await Task.find({ relatedTo: relatedIds[i] })
            .populate('contact', 'firstName lastName email')
            .populate('user', 'firstName lastName fullName')
            .exec();
        allTasks = allTasks.concat(tasks);
	}
	allTasks = checkDuplicateItem(allTasks);
	console.log(allTasks);
    return res.status(200).json(allTasks);
}

async function updateTask(req, res) { 
	const { id } = req.params;
	const { name,date, time, description, taskType, priority,status} = req.body;
	const newTask = await Task.findByIdAndUpdate(
		id,
		{ date, time, description, taskType, priority,name,status},
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
		{ tasks: task._id },
		{
			$pull: {
					tasks: task._id 
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
	user.tasks.addToSet(taskId);
	await user.save();
}

async function updateAssignedUser(req, res) {
	const { taskId,userId} = req.params;
	const task = await Task.findById(taskId).exec();
	const user =await User.findById(userId).exec();

	if (!task || !user) {
	  return res.status(404).json("task or user not exist");
	}
	user.tasks.addToSet(taskId);
    task.users.addToSet(userId);
    await user.save();
    await task.save();
    return res.status(200).json(task);
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
	task.users.pull(userId);
	if (task.users.length === 0){
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
	getTasksByMultiContacts,
	getAllTasks,
	updateTask,
	deleteTask,
	updateAssignedUser,
	removeAssignedToUser,
}