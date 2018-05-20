'use strict'

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
var Schema = mongoose.Schema
var moment = require('moment')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// task schema
const taskSchema = new Schema({
  _id: { type: mongoose.Schema.ObjectId },
  title: { type: String, required: 'Please type in a task name.', trim: true },
  createdOn: { type: Date, default: moment() },
  completedOn: { type: Date, default: null },
  timeToComplete: [{ type: Number }, { type: Number }],
  status: { type: Boolean, required: 'Please enter a status', default: false },
  time: { type: Number, required: 'Please enter a time in minutes' },
  filter: { type: String, required: 'Please type in a filter.', default: 'inbox' },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
})

const UserSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId, auto: true },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  tasks: [{ type: mongoose.Schema.ObjectId, ref: 'Task' }]
})

UserSchema.methods.serialize = function() {
  return {
    _id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  }
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10)
}

const User = mongoose.model('User', UserSchema)

const Task = mongoose.model('Task', taskSchema)

module.exports = { Task, User }
