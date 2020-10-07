const Task = require('../models/Task');

async function addTask(req, res) { 
	const { content, author} = req.body;
	const task = new Task({
		content,
		author
	});
	await task.save();
	return res.json(task);
}

async function getTask(req, res) { 
	const { id } = req.params;
	const task = await Task.findById(id).exec();
	if (!task) {
		return res.status(404).json('task not found');
	}
	return res.json(task);
}

async function getAllTasks(req, res) { 
	const tasks = await Task.find().exec();
	return res.json(tasks);
}


async function updateTask(req, res) { 
	const { id } = req.params;
	const { content, author} = req.body;
	const newTask = await Task.findByIdAndUpdate(
		id,
		{ content, author },
		{
			new: true 
		}
	).exec();
	if (!newTask) {
		return res.status(404).json('tasks not found');
	}
	return res.json(newTask);
}

async function deleteTask(req, res) { 
	const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
	if (!task){
		return res.status(404).json('task not found');
	}
	return res.sendStatus(204);
}


module.exports = {
	addTask,
	getTask,
	getAllTasks,
	updateTask,
	deleteTask
}