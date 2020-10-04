const express = require('express');

const { 
	getAllNotes, 
	addNote, 
  getNote, 
  getNoteByRelatedToId,
	updateNote, 
	deleteNote 
} = require('../controllers/notes');

const router = express.Router();

router.get('/', getAllNotes);
router.get('/:id', getNote);
router.get('/relatedTo/:id', getNoteByRelatedToId);
router.post('/', addNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;