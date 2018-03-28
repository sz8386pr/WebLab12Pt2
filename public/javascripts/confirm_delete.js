// reference from https://github.com/minneapolis-edu/todo_mlab_PART2/blob/master/public/javascripts/confirm_delete.js

// Find all the delete buttons, add a click event listener to all buttons
// On click event, show a confirm dialog
// Browsers will handle these events before the click that submits the form
// to provide the opportunity to intercept the form submit with JavaScript.
// If the click event handler prevents the event propagating, the form submit
// never happens.  If the click event doesn't prevent the event propagating,
// the form will be submitted as usual.

var deleteButtons = document.querySelectorAll('.delete-all-done');

deleteButtons.forEach(function(button){

  button.addEventListener('click', function(ev){

    // Show a confirm dialog
    var okToDelete = confirm("This will delete all finished tasks - are you sure?");

    // If user presses no, prevent the form submit
    if (!okToDelete) {
      ev.preventDefault();  // Prevent the click event propagating
    }

  })
});
