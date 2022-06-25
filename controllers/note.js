const { StatusCodes } = require('http-status-codes')
const Note = require('../models/Note')

const createNote = async (req, res) => {
  const {
    body: { title, description },
    userID,
  } = req

  try {
    const note = await Note.create({ title, description, createdBy: userID })
    res
      .status(StatusCodes.CREATED)
      .json({ msg: 'Note created successfully', note })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMsg = Object.values(error.errors)
        .map((item) => item.message)
        .join(', ')
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMsg })
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error' })
  }
}

const getAllNote = async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.userID }).select('-__v')
    res.status(StatusCodes.OK).json({ notes, count: notes.length })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error' })
  }
}

const getNote = async (req, res) => {
  const {
    params: { id: noteID },
    userID,
  } = req

  try {
    const note = await Note.findOne({
      _id: noteID,
      createdBy: userID,
    }).select('-__v')

    if (!note) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Note not found with id ${noteID}` })
    }

    res.status(StatusCodes.OK).json({ note })
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Note not found with id ${noteID}` })
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error', error })
  }
}

const updateNote = async (req, res) => {
  const {
    userID,
    params: { id: noteID },
    body: { title, description },
  } = req

  try {
    let note = await Note.findOne({
      _id: noteID,
      createdBy: userID,
    })

    if (!note) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Note not found with id ${noteID}` })
    }

    note = await Note.findByIdAndUpdate(
      {
        _id: noteID,
        createdBy: userID,
      },
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v')

    res.status(StatusCodes.OK).json({ note })
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Note not found with id ${noteID}` })
    }

    if (error.name === 'ValidationError') {
      const errorMsg = Object.values(error.errors)
        .map((item) => item.message)
        .join(', ')
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMsg })
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error', error })
  }
}

const deleteNote = async (req, res) => {
  const {
    userID,
    params: { id: noteID },
  } = req

  try {
    const note = await Note.findByIdAndDelete({
      _id: noteID,
      createdBy: userID,
    })

    if (!note) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Note not found with ${noteID}` })
    }

    res.status(StatusCodes.OK).json({ msg: 'Note deleted successfully', note })
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Note not found with id ${noteID}` })
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error', error })
  }
}

module.exports = {
  createNote,
  getAllNote,
  getNote,
  updateNote,
  deleteNote,
}
