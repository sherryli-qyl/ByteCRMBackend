const Note = require('../models/note');
const User = require('../models/user');

async function addNote(req, res) { 
  const { relatedTo, content, createdBy, comments, type, isDeleted } = req.body;
  const user = await User.findById(createdBy).exec();
  const note = new Note({
    relatedTo,
    content,
    createdBy,
    comments,
    type,
    isDeleted,
  });
  note.user = user;
  
  await note.save();
  const resNote = await Note.findOne({_id: note._id})
    .populate('createdBy', 'firstName lastName fullName')
    .exec();
  return res.json(resNote);
}


async function getNote(req, res) { 
  const { id } = req.params;
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(404).json('note not found');
  }
  return res.json(note);
}


async function getNoteByRelatedToId(req, res) { 
  const { id } = req.params;
  const notes = await Note.find({relatedTo: id})
    .populate('createdBy', 'firstName lastName fullName')
    .populate('relatedTo','firstName lastName email')
    .exec();
  
  if (!notes) {
    return res.status(404).json(id);
  }
  return res.status(200).json(notes);

}


async function getAllNotes(req, res) { 
  const notes = await Note.find().exec();
  return res.status(200).json(notes);
}


async function updateNote(req, res) { 
  const { id } = req.params;
  const { content, createdBy, comments } = req.body;
  const newNote = await Note.findByIdAndUpdate(
    id,
    { content, createdBy, comments },
    {
      new: true 
    }
  ).exec();
  if (!newNote) {
    return res.status(404).json('notes not found');
  }
  return res.status(202).json(newNote);
}


async function deleteNote(req, res) { 
  const { id } = req.params;
  const note = await Note.findByIdAndDelete(id).exec();
  
  if (!note){
    return res.status(404).json('note not found');
  }
  return res.sendStatus(204);
}

async function addComment(req, res) {
  const { id } = req.params;
  const comment = { ...req.body };

  const note = await Note
    .findByIdAndUpdate(toObjectId(id),
      { 
        $push: {
          comments: comment
        }
      },
      { new: true }
    )
    .exec();

  if (!note) throw new HttpError(404, 'Note not found.');

  return sendResult(res, note);
};


module.exports = {
  addNote,
  getNote,
  getNoteByRelatedToId,
  getAllNotes,
  updateNote,
  deleteNote,
  addComment,
}