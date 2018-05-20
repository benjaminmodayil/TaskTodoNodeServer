var express = require('express')
var router = express.Router()

// const passport = require('passport')
// const jwtAuth = passport.authenticate('jwt', {
//   session: false,
//   failureRedirect: '/login',
//   // causing redirects on login
//   failureFlash: true
// })

const tc = require('../controllers/taskController')
// const { Task } = require('../models')

// PAGES tasks
// router.get('/', jwtAuth, tc.tasksPage)
// //
// router.get('/edit/:id', jwtAuth, tc.tasksEditPage)
// router.post('/edit/:id', jwtAuth, tc.taskEdit// router.get('/new', jwtAuth, tc.taskNewPage)
// router.post('/new', jwtAuth, tc.taskNew)

// API tasks
router.get('/', tc.getTasksAPI)

router.get('/:id', tc.getTaskIDAPI)

router.post('/', tc.postTasksAPI)

router.delete('/:id', tc.deleteTasksAPI)

router.put('/:id', tc.putTasksAPI)

module.exports = router
