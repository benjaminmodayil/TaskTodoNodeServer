const mongoose = require('mongoose')
const { Task, User } = require('../models')
// var moment = require('moment')

// API integration 👇 All below
exports.getTasksAPI = (req, res, next) => {
  console.log(req.user)
  Task.find()
    .where('user')
    .equals(req.user._id)
    .sort({ createdOn: -1 })
    .then(items => {
      console.log(items)
      res.status(200).json({
        tasks: items
      })
    })
}

// Get Specific Task
exports.getTaskIDAPI = (req, res, next) => {
  Task.findById(`${req.params.id}`)
    .then(item => {
      res.status(200).json({
        tasks: item
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: 'something went wrong' })
    })
}

// POST Task
exports.postTasksAPI = async (req, res) => {
  const reqFields = ['title', 'filter', 'time']

  for (let i = 0; i < reqFields.length; i++) {
    const field = reqFields[i]

    if (!(field in req.body)) {
      const message = `Missing required '${field}' in req.body`
      console.error(message)
      return res.status(400).send(message)
    }
  }

  try {
    let item = await Task.create({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      user: req.user._id,
      createdOn: req.body.createdOn,
      completedOn: req.body.completedOn,
      totalTime: req.body.totalTime,
      // completedOn might become an issue if a user is ever allowed to manipulate records
      status: req.body.status,
      time: req.body.time,
      filter: req.body.filter
    })

    res.status(201).json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

// DELETE a Task
exports.deleteTasksAPI = (req, res, next) => {
  Task.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'success' })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong. 😢' })
    })
}

// PUT/UPDATE a specific Task
exports.putTasksAPI = (req, res, next) => {
  if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match.'
    })
    return
  }

  const updated = {}
  const updateableFields = [
    'title',
    'completedOn',
    'totalTime',
    'status',
    'time',
    'filter',
    'timeToComplete'
  ]

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  })

  Task.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedItem => res.status(200).json(updatedItem))
    .catch(err => res.status(500).json(console.log(err), { err }))
}
