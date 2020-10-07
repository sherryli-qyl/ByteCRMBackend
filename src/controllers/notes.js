const Note = require('../models/note');

async function addNote(req, res) { 
	const { content, author, comments } = req.body;
	const note = new Note({
		content,
		author,
		comments
	});
	await note.save();
	return res.json(note);
}

async function getNote(req, res) { 
	const { id } = req.params;
	const note = await Note.findById(id).exec();
	if (!note) {
		return res.status(404).json('note not found');
	}
	return res.json(note);
}

async function getAllNotes(req, res) { 
	const notes = await Note.find().exec();
	return res.json(notes);
}


async function updateNote(req, res) { 
	const { id } = req.params;
	const { content, author, comments } = req.body;
	const newNote = await Note.findByIdAndUpdate(
		id,
		{ content, author, comments },
		{
			new: true 
		}
	).exec();
	if (!newNote) {
		return res.status(404).json('notes not found');
	}
	return res.json(newNote);
}

async function deleteNote(req, res) { 
	const { id } = req.params;
  //const note = await (await Note.findByIdAndDelete(id)).exec();
  const note = await (await Note.findByIdAndDelete(id));
	if (!note){
		return res.status(404).json('note not found');
	}
	return res.sendStatus(204);
}


module.exports = {
	addNote,
	getNote,
	getAllNotes,
	updateNote,
	deleteNote
}