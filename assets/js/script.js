// List of Quiz questions and answers
var questions = [
    {
      question: "What is the Capital of Canada?",
      choices: ["Quebec", "Ottawa", "Vancouver", "Montreal", "Toronto"],
      answer: "Ottawa",
    },
    {
      question: "Who invented the lightbulb?",
      choices: ["Thomas Edison", "Lewis Howard", "Michael Faraday", "Alexander Lodygin"],
      answer: "Thomas Edison",
    },
    {
      question: "If a backyard is 50 feet long and 20 feet wide, how many square feet is the yard?",
      choices: ["100 sq ft", "70 sq ft", "1000 sq ft", "2000 sq ft"],
      answer: "1000 sq ft",
    },
    {
      question: "What is the process of water turning into vapor called?",
      choices: ["Evaporation", "Dehydration", "Dissipation", "Melting", "Vanishing"],
      answer: "Evaporation",
    },

    {
      question: "On the periodic table, which element is represented by the letter N?",
      choices: ["Nickel", "Zinc", "Nitrogen", "Helium", "Sodium"],
      answer: "Nitrogen",
    },
  ];

// DOM Elements
var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#timer");
var choicesEl = document.querySelector("#options");
var submitBtn = document.querySelector("#submit-score");
var startBtn = document.querySelector("#start");
var nameEl = document.querySelector("#name");
var feedbackEl = document.querySelector("#feedback");
var reStartBtn = document.querySelector("#restart");
var scoresBtn = document.querySelector("#view-high-scores");
var clearScoresBtn = document.querySelector("#clear");

// Initial stage of the quiz
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

//Starting quiz and hiding the front page
function quizStart(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  timerId = setInterval(clockTick, 1000);
  timerEl.textContent = time;
  var landingScreenEl = document.getElementById("start-screen");
  landingScreenEl.setAttribute("class", "hide");
  questionsEl.removeAttribute("class");
  getQuestion();
}

// Loop through array of questions and answers, create a list with buttons
function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  var promptEl = document.getElementById("question-words")
  promptEl.textContent = currentQuestion.question;
  choicesEl.innerHTML = "";
  currentQuestion.choices.forEach(function(choice, i) {
    var choiceBtn = document.createElement("button");
    choiceBtn.setAttribute("value", choice);
    choiceBtn.textContent = i + 1 + ". " + choice;
    choiceBtn.onclick = questionClick;
    choicesEl.appendChild(choiceBtn);
  });
}

// Checking for the correct answer and deducting time for the wrong answers. Going to the next question.
function questionClick() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.color = "red";
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
  }
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 2000);
  currentQuestionIndex++;
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// End quiz, hide the questions, stop the timer and show the final score
function quizEnd() {
  clearInterval(timerId);
  var endScreenEl = document.getElementById("quiz-end");
  endScreenEl.removeAttribute("class");
  var finalScoreEl = document.getElementById("score-final");
  finalScoreEl.textContent = time;
  questionsEl.setAttribute("class", "hide");
  saveHighscore(); // Save the score when quiz ends
}

// End quiz if the timer reaches 0
function clockTick() {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    quizEnd();
  }
}

// Saving player's name and score in local storage
function saveHighscore() {
  var name = nameEl.value.trim();
  if (name !== "" && currentQuestionIndex === questions.length) {
      var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
      var newScore = {
          score: time,
          name: name
      };
      highscores.push(newScore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
  }
}

// Function to print high scores
function printHighscores() {
  var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
  var highscoresList = document.getElementById("highscores");
  highscoresList.innerHTML = ""; // Clear previous entries
  highscores.forEach(function(score) {
    var liTag = document.createElement("li");
    liTag.textContent = score.name + " - " + score.score;
    highscoresList.appendChild(liTag);
  });
}

// Event listener for restarting the quiz
reStartBtn.addEventListener("click", function() {
  restartQuiz();
});

// Flag to indicate if the score has been submitted
var scoreSubmitted = false;

// Saving player's name and score in local storage
function saveHighscore() {
  var name = nameEl.value.trim();
  if (name !== "" && currentQuestionIndex === questions.length && !scoreSubmitted) {
      var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
      var newScore = {
          score: time,
          name: name
      };
      highscores.push(newScore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
      scoreSubmitted = true; // Set the flag to true
  }
}

// Function to restart the quiz
function restartQuiz() {
  currentQuestionIndex = 0;
  time = questions.length * 15;
  clearInterval(timerId);
  timerId = null;
  quizStart(event);

  // Reset the scoreSubmitted flag
  scoreSubmitted = false;

  // Hide the high scores area
  var highscoresEl = document.querySelector(".highscores");
  highscoresEl.classList.add("hide");

  // Hide the final score message area
  var finalScoreMessageEl = document.getElementById("quiz-end");
  finalScoreMessageEl.classList.add("hide");
}

// Start quiz by clicking start quiz
startBtn.addEventListener("click", function(event) {
  quizStart(event);
});

// Event listener for viewing high scores
scoresBtn.addEventListener("click", function() {
  viewHighScores();
});

// Function to view high scores
function viewHighScores() {
  var highscoresEl = document.querySelector(".highscores");
  highscoresEl.classList.toggle("hide");
  printHighscores();
}

// Event listener for clearing high scores
clearScoresBtn.addEventListener("click", function() {
  clearHighscores();
});

// Function to clear high scores
function clearHighscores() {
  window.localStorage.removeItem("highscores");
  printHighscores();
}

// Saving player's score by clicking enter
nameEl.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
});

// Saving player's score by clicking submit
submitBtn.onclick = saveHighscore;
