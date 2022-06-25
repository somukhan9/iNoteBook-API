const router = require('express').Router()
const Note = require('../models/Note')
const {
  createNote,
  getAllNote,
  getNote,
  updateNote,
  deleteNote,
} = require('../controllers/note')

router.route('/').post(createNote).get(getAllNote)
router.route('/:id').get(getNote).patch(updateNote).delete(deleteNote)

module.exports = router
