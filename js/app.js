/*------------------ MODEL ------------------*/
var Model = function () {
  this.randomNum;
  this.maxNum;
  this.guessCount = 0;
};

Model.prototype.generateRandomNum = function (maxNum) { // maxNum would come from View
  this.maxNum = maxNum;
  this.randomNum = Math.floor((Math.random() * this.maxNum) + 1);
};

Model.prototype.resetGame = function () {
  this.guessCount = 0;
};

Model.prototype.getCurrentDiff = function (userGuess) {
  var difference = Math.abs(userGuess - this.randomNum);

  if (difference >= 50) {
    return 'Ice Cold!';
  } else if (difference >= 30) {
    return 'Cold';
  } else if (difference >= 10) {
    return 'Warm';
  } else if (difference >= 1) {
    return 'Very HOT!';
  } else {
    return 'You got it!';
  }
};

Model.prototype.incGuessCount = function () {
  this.guessCount++;
};

/*------------------ VIEW ------------------*/
var View = function () {
  this.guessList = $('#guessList');
  this.guessCount = $('#count');
  this.userGuess = $('#userGuess');
  this.feedback = $('#feedback');
  this.guessRange = $('#guessRange');
  this.header = $('header');
  this.maxNum = $('#maxNum');
  this.navWhat = $('.what');
  this.overlay = $('.overlay');
  this.navClose = $('.close');
  this.form = $('form');
  this.newButton = $('.new');

  this.navWhat.click(function () {
    this.overlay.fadeIn(1000);
  }.bind(this));

  /*--- Hide information modal box ---*/
  this.navClose.click(function () {
    this.overlay.fadeOut(1000);
  }.bind(this));

  this.form.submit(this.answerSubmitted.bind(this));
  this.newButton.click(this.newGame.bind(this));

  this.onChange = null;
  this.onNew = null;
};

View.prototype.newGame = function () {
  if (this.onNew) {
    this.onNew();
  }
};

View.prototype.answerSubmitted = function () {
  event.preventDefault();
  // assigns and parses the inputed guess
  var userGuess = parseInt(this.userGuess.val()); //model

  if (this.onChange) {
    this.onChange(userGuess);
  }
};

View.prototype.onLoad = function () {
  var input;
  //prompts for a ceiling number
  while (true) {
    input = parseInt(prompt('Pick a number, any number!'));
    if (input > 1) {
      this.guessRange.text('Guess a number between 1 and ' + input);
      // adds the ceiling number to the instructions html
      this.maxNum.text(input); // VIEW
      return input;
    }
  }
};

// ADDS LIST ELEMENTS TO #GUESSLIST
View.prototype.appendGuessList = function (user) {
  this.guessList.append('<li>' + user + '</li>');
};

View.prototype.reset = function () {
  this.guessList.empty();
  this.guessCount.text('0');
  this.userGuess.val('');
  this.feedback.text('Make your Guess!');
  this.guessRange.empty();
};

View.prototype.enterValidNum = function () {
  this.userGuess.val('');
  alert('Please enter a valid number');
}

View.prototype.guessPassed = function (count) {
  this.guessCount.text(count);
  this.userGuess.val('');
}

var Controller = function (view, model) {
  this.view = view;
  this.model = model;

  this.view.onChange = this.guessEntered.bind(this);
  this.view.onNew = this.restartGame.bind(this);

  this.model.generateRandomNum(this.view.onLoad());
};

Controller.prototype.guessEntered = function (userGuess) {
  // determines if input is a number
  if (!(isNaN(userGuess)) && userGuess > 0 && this.model.maxNum) { // VIEW

    // function to track all guesses
    this.view.appendGuessList(userGuess);

    // function to provide feedback
    this.view.feedback.text(this.model.getCurrentDiff(userGuess));

    // sets the number of guesses
    this.model.incGuessCount();

    this.view.guessPassed(this.model.guessCount);

    // logs the guess as the 'previous' guess
  } else { // if not a number, prompts to enter a number
    this.view.enterValidNum();
  }
};

Controller.prototype.restartGame = function () {
  this.view.reset();
  this.model.resetGame();
  this.model.generateRandomNum(this.view.onLoad());
};

$(document).ready(function () {
  var model = new Model();
  var view = new View();
  var controller = new Controller(view, model);
});


// //// COMPARES NUMBER TO PREVIOUS GUESS AND GIVES SECONDARY FEEDBACK
// //function compareNumRest(currentNum, oldNum, randNum) {
// //  // checks how far guess is from generated number
// //  var currentDiff = Math.abs(currentNum - randNum);
// //
// //  // checks how far previous guess is from generated number
// //  var oldNewDiff = Math.abs(oldNum - randNum);
// //
// //  // compares two numbers and provides feedback
// //  if (currentDiff > oldNewDiff) {
// //    $('#relative-feedback').text('Colder');
// //  } else if (currentDiff < oldNewDiff) {
// //    $('#relative-feedback').text('Warmer');
// //    $('#guessList li').last().addClass('warmer');
// //  } else {
// //    $('#relative-feedback').text('No change');
// //  }
// //}
