$(document).ready(function () {
  /*------------------ VARIABLES ------------------*/
  var input;
  var randomNum;
  var guessCount = 0;
  var prevUserGuess = 0;

  /*------------------ FUNCTIONS ------------------*/

  // STARTS A BRAND NEW GAME
  function newGame() {
    randomNum = generateRandomNum();
    $('#guessList').empty();
    $('#count').text(guessCount);
    $('#userGuess').val('');
    $('#feedback').text('Make your Guess!');
    $('#relative-feedback').text('');
    $('#guessRange').remove();
  }

  // GENERATES A RANDOM NUMBER FROM 1 TO USER INPUT
  function generateRandomNum() {
    // prompts for a ceiling number
    while (true) {
      input = parseInt(prompt('Pick a number, any number!'))
      if (input > 1) {
        break;
      }
    }

    // generates random number from 1 to input
    var number = Math.floor((Math.random() * input) + 1);

    // adds a header telling them the range
    $('header').append('<h3 id="guessRange">Guess a number between 1 and ' + input);

    // adds the ceiling number to the instructions html
    $('#maxNum').text(input);
    return number;
  }

  // ADDS LIST ELEMENTS TO #GUESSLIST
  function guessList(user) {
    $('#guessList').append('<li>' + user + '</li>');
  }

  // COMPARES NUMBER TO GENERATED NUMBER AND GIVES FEEDBACK
  function compareNumFirst(user, random) {
    var difference = Math.abs(user - random);
    // determines how hot/cold the number is
    if (difference >= 50) {
      $('#feedback').text('Ice Cold!');
    } else if (difference >= 30) {
      $('#feedback').text('Cold');
    } else if (difference >= 10) {
      $('#feedback').text('Warm');
      $('#guessList li').last();
    } else if (difference >= 1) {
      $('#feedback').text('Very HOT!');
      $('#guessList li').last();
    } else {
      $('#feedback').text('You got it!');
      $('#guessList li').last().addClass('winner');
    }
  }
  // COMPARES NUMBER TO PREVIOUS GUESS AND GIVES SECONDARY FEEDBACK
  function compareNumRest(currentNum, oldNum, randNum) {
    // checks how far guess is from generated number
    var currentDiff = Math.abs(currentNum - randNum);

    // checks how far previous guess is from generated number
    var oldNewDiff = Math.abs(oldNum - randNum);

    // compares two numbers and provides feedback
    if (currentDiff > oldNewDiff) {
      $('#relative-feedback').text('Colder');
    } else if (currentDiff < oldNewDiff) {
      $('#relative-feedback').text('Warmer');
      $('#guessList li').last().addClass('warmer');
    } else {
      $('#relative-feedback').text('No change');
    }
  }


  /*------------------ CODE BODY ------------------*/

  /*--- Display information modal box ---*/
  $('.what').click(function () {
    $('.overlay').fadeIn(1000);

  });
  /*--- Hide information modal box ---*/
  $('a.close').click(function () {
    $('.overlay').fadeOut(1000);
  });

  // STARTS THE GAME
  newGame();

  // WAITS FOR GUESS BUTTON TO BE CLICKED
  $('form').submit(function () {
    event.preventDefault();

    // assigns and parses the inputed guess
    var userGuess = parseInt($('#userGuess').val());

    // determines if input is a number and in the right range
    if (!(isNaN(userGuess)) && userGuess > 0 && userGuess <= input) {

      // function to track all guesses
      guessList(userGuess);

      // if its the first guess runs the initial compare
      if (guessCount === 0) {
        compareNumFirst(userGuess, randomNum);
      } else {
        compareNumFirst(userGuess, randomNum);
        compareNumRest(userGuess, prevUserGuess, randomNum);
      }

      // sets the number of guesses
      guessCount++;
      $('#count').text(guessCount);

      // clears the input field
      $('#userGuess').val('');

      // logs the guess as the 'previous' guess
      prevUserGuess = userGuess;
    } else { // if not a number, prompts to enter a number
      $('#userGuess').val('');
      alert('Please enter a valid number.');
    }
  });

  // WAITS FOR NEW GAME TO BE CLICKED TO RESET THE GAME
  $('.new').click(function () {
    // completely resets the game
    guessCount = 0;
    newGame();
  });

});
