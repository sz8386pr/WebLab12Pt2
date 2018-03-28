/**
 * Created by sz8386pr on 3/20/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//define a schema - what fields will a task document have?
var taskSchema = new Schema({
    text: String,
    completed: Boolean,
    dateCreated: Date,
    dateCompleted: Date,
});

// compile taskSchma desc into a Mongoose model with the name 'Task'
var Task = mongoose.model('Task', taskSchema);

Task.find({completed: true})
    .then( (docs) => {
        res.render('completed_tasks', {tasks: docs});
    })
    .catch( (err) => {
        next(err);
    });

// export the Task model for use in the application
module.exports = Task;
