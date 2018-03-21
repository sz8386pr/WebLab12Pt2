var express = require('express');
var router = express.Router();
var Task = require('../models/task');

/* GET home page. */
router.get('/', function(req, res, next) {

  Task.find( {completed: false} )
      .then( (docs) => {
        res.render('index', {title: 'Incomplete tasks', tasks: docs} );
      })
      .catch( (err) => {
        next(err);  // forward to the error handlers
      })

});

// POST to create a new task

router.post('/add', function(req, res, next){

    // Check if something was entered in the text input
    if (req.body.text) {
        //create new Task
        var t = new Task({text: req.body.text, completed: false})
        // save the task, and redirect to home page if successful
        t.save().then((newTask) => {
            console.log('The new task created is ', newTask); //debug
            res.redirect('/');  // Creates a GET request to
        }).catch(() => {
            next(err);  // Forward error to the error handlers
        });
    }
    else {
        res.redirect('/');  // else, ignore and redirect to homepage
    }
});


// POST to mark a task as done

router.post('/done', function(req, res, next){

    Task.findByIdAndUpdate( req.body._id, {completed:true})
        .then( (originalTask) => {
            // originalTask only has a value if a document with this _id was found
            if (originalTask) {
                res.redirect('/'); // redirect to list of tasks
            }
            else {
                var err = new Error('Not Found');  // report Task not found with 404 status
                err.status = 404;
                next(err);
            }
        })
        .catch( (err) => {
            next(err);  // to error handlers
        });
});

// GET completed tasks
router.get('/completed', function(req, res, next){

    Task.find({completed:true})
        .then( (docs) => {
            res.render('completed_tasks', { title: 'Completed tasks', tasks: docs });
        }).catch( (err) => {
            next(err);
        });

});

router.post('/delete', function(req, res, next){

    Task.findByIdAndRemove(req.body._id)
        .then( (deletedTask) => {
            if (deletedTask) {
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

module.exports = router;
