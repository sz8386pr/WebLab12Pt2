var express = require('express');
var router = express.Router();
var Task = require('../models/task.js');

// Ensure that user is logged in before they can do any thing
// Create a middleware function to check if user is logged in
function isLoggedIn(req, res, next) {
    console.log('user is auth ', req.user);
    if (req.isAuthenticated()) {
        res.locals.username = req.user.local.username;
        next();
    } else {
        res.redirect('/auth')
    }
}

// This will require all the routes in this file to use isLoggedIn middleware
router.use(isLoggedIn);

/* GET home page. */
router.get('/', function(req, res, next) {

  Task.find( { _creator : req.user, completed: false} )
      .then( (docs) => {
        res.render('index', {title: 'TODO list', tasks: docs} );
      })
      .catch( (err) => {
        next(err);  // forward to the error handlers
      })

});

// POST to create a new task

router.post('/add', function(req, res, next){

    // Check if something was entered in the text input
    if (req.body.text || req.body ) {
        //create new Task
        var t = new Task({ _creator: req.user, text: req.body.text, completed: false, dateCreated: Date.now()});
        // save the task, and redirect to home page if successful
        t.save().then((newTask) => {
            console.log('The new task created is ', newTask); //debug
            res.redirect('/');  // Creates a GET request to
        }).catch(() => {
            next(err);  // Forward error to the error handlers
        });
    }
    else {
        req.flash('error', 'Please enter a task.');
        res.redirect('/');  // else, ignore and redirect to homepage
    }
});


// POST to mark a task as done

router.post('/done', function(req, res, next){

    // Find if the task exists
    Task.find({_id: req.body._id})
        .then( (task) => {
            if (!task) {
                res.status(404).send('There is no task with this id!');
            }
        }).catch( (err) => {
        next(err);
    });

    Task.findByIdAndUpdate( {_id: req.body._id, _creator: req.user.id}, {dateCompleted: Date.now(), completed:true})
        .then( (task) => {
            // originalTask only has a value if a document with this _id was found
            if (!task) {
                res.status(403).send('This is not your task!');
            }
            else {
                req.flash('info', 'Task marked as done');
                res.redirect('/');
            }

        })
        .catch( (err) => {
            next(err);  // to error handlers
        });
});

// GET completed tasks
router.get('/completed', function(req, res, next){

    Task.find({_creator: req.user._id, completed:true})
        .then( (docs) => {
            res.render('completed_tasks', { title: 'Completed tasks', tasks: docs });
        }).catch( (err) => {
            next(err);
        });

});

// POST delete tasks
router.post('/delete', function(req, res, next){

    Task.findByIdAndRemove(req.body._id)
        .then( (deletedTask) => {
            if (deletedTask) {
                req.flash('info', deletedTask.text + ' deleted');
                res.redirect('/');
            } else {
                var error = new Error('Task Not Found')
                error.status = 404;
                next(error);
            }
        })
        .catch( (err) => {
            next(err);
        })
});

// POST mark all tasks as done

router.post('/alldone', function(req, res, next){

    Task.updateMany({_creator: req.user, completed: false}, {dateCompleted: Date.now(), completed: true}, {multi: true})
        .then( (result) => {
            req.flash('info', 'All tasks are done!');
            res.redirect('/');  // if prefered, redirect to /completed
        })
        .catch( (err) => {
            next(err);
        });
});

// GET task specific/detail page

router.get('/task/:_id', function(req, res, next){

    Task.findById(req.params._id)
        .then( (task) => {
            if (!task) {
                res.status(404).send('Task not found.');
            }
            else if (!task._creator.equals(req.user._id)) {
                res.status(403).send('This is not your task!')
            }
            else {
                res.render('task', {task: task,})
            }
        })
        .catch( (err) => {
            next(err);
        });
});

// POST delete all completed tasks

router.post('/deleteDone', function(req, res, next){

    Task.deleteMany({completed: true})
        .then( () => {
            req.flash('info', 'All completed tasks deleted')
            res.redirect('/');  // redirect to index page
        })
        .catch( (err) => {
            next(err);
        });
});

module.exports = router;
