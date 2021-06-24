// || DOCUMENT ELEMENTS
// local storage
let localStorage = window.localStorage;
// buttons
let startBtn = document.querySelector('#start_button');
let endBtn = document.querySelector('#end_button');
// timer
let timerElement = document.querySelector('#timer_value');
// questions
let questionSection = document.querySelector('#question');
// answers
let answerSection = document.querySelector('#answers');
// feedback
let feedbackSection = document.querySelector('#feedback')
// player results table
let playerTable = document.querySelector('#player_table');

// || GLOBAL SETTINGS AND VARIABLES
questions = [];
currentQuestion = new Object;
currentQuestionIndex = 0;
score = 0;
timerValue = 30;
let feedbackTimeout = 2000;

// || STRUCTURES
class Question{
    constructor(question, answers, correctIndex){
        this.question = question;
        this.answers = answers;
        this.correctIndex = correctIndex;
        this.choiceIndex = undefined;
        this.correct = false;
    }

    render(){
        // reset question div
        questionSection.textContent = '';
        // render question
        let questionElement = document.createElement('h2');
        questionElement.id="question_text";
        questionElement.textContent = this.question;
        questionSection.appendChild(questionElement);
    
        // render answers as buttons
        for(let i = 0; i<this.answers.length; i++){
            let answerButton = document.createElement('button')
            answerButton.className="answer_button";
            answerButton.setAttribute('data-index',i);
            answerButton.textContent = this.answers[i];
            answerSection.appendChild(answerButton);
        }

        addEventListenersForAnswerButtons();
    }

}

class UserScores{
    constructor(){
        // load results from storage first
        this.results = [];
        this.load();
    }

    addScore(initials, score){
        // add the result to the score object stored values
        this.results.push({'initials': initials, 'score': score})
        this.sort(false);
    }

    sort(ascending){
        if (ascending){
            this.results.sort(compareAsc);
        } else {
            this.results.sort(compareDesc);
        }
    }

    save(){
        localStorage.setItem('userScores', JSON.stringify(this.results));
    }

    load(){
        // get results from the save store
        let loadedResults = JSON.parse(localStorage.getItem('userScores'));
        if (loadedResults){
            this.results = loadedResults;
        } else {
            // if object has no records in memory, start it off as empty
            console.log('No result found in local storage, results are empty')
        }
        
    }

    clearDisplay(){
        playerTable.textContent = '';
        console.log('cleared display of high scores');
    }

    render(){
        // flag for empty result case
        let results = false;
        // make sure we aren't just appending to the list
        this.clearDisplay();
        for(let i =0; i<this.results.length; i++){
            // create table row element
            let tableRow = document.createElement('tr');

            // define row properties
            tableRow.setAttribute('data-index', i);
            tableRow.className = "highscore_row";

            // create table data elements and set class names
            let tableDataInitial = document.createElement('td');
            tableDataInitial.className = "table_data_initial";
            let tableDataScore = document.createElement('td');
            tableDataScore.className = "table_data_score";

            // attach table data to row
            tableRow.appendChild(tableDataInitial);
            tableRow.appendChild(tableDataScore);
            // attach table row to table
            playerTable.appendChild(tableRow);
            // set so we know results were printed
            results = true;
        }
        // if no results were printed
        if(!results){
            // create announcement node to display that no results were rendered
            let announcement = document.createElement('h3');
            // add announcement text
            announcement.innerText = 'No results found in local storage';
            // get parent div of the table
            let tablePlayerBoard = document.querySelector('#player_board');
            tablePlayerBoard.appendChild(announcement);
        }
    }
}

// || UTILITIES
function compareAsc(a, b){ 
    if (a.score < b.score){
        return 1
    } else if (a.score > b.score){
        return -1
    } else {
        return 0
    }
}

function compareDesc(a, b){
    if (a.score > b.score){
        return 1
    } else if (a.score < b.score){
        return -1
    } else {
        return 0
    }
}

// || FUNCTIONS
function addEventListenersForAnswerButtons(){
    // add event listener to buttons created
    let buttonElements = document.querySelectorAll('.answer_button');
    for(let i=0; i<buttonElements.length; i++){
        buttonElements[i].addEventListener('click', guess);
    }
}

function addEventListenersForUserForm(){
    let submitBtn = document.querySelector('#submit_button');
    let cancelBtn = document.querySelector('#cancel_button');

    submitBtn.addEventListener('click', submitUserForm);
    cancelBtn.addEventListener('click', cancelUserSubmission);
}

function announceFeedback(feedback){
    let feedbackElement = document.createElement('p')
    feedbackElement.className = "feedback_text";
    feedbackElement.innerText = feedback;
    feedbackSection.appendChild(feedbackElement);

    setTimeout(function (){
        feedbackSection.textContent = "";
    }, feedbackTimeout)
}

function buildQuestions(){
    questions.push(new Question(
        'How many?', ['Too many', 'Not enough', 'Just right', 'Other'], 2
    ));
    questions.push(new Question(
        'Why?', ['Because', 'Because Why Not', 'Because I said so', 'Do it!'], 3
    ));
}

function buildUserInitialsForm(){
    // update question area to ask user for initials
    // update answer area with an input field
    // update feedback area with a submit and cancel button
    let formElement = document.createElement('form');
    let prompt = document.createElement('h2');
    let userInput = document.createElement('input');
    let userSubmit = document.createElement('button');
    let userCancel = document.createElement('button');

    prompt.innerText = 'Add initials to store your score';
    userInput.id="user_input"
    userSubmit.innerText = 'SAVE';
    userSubmit.id="submit_button";
    userSubmit.setAttribute('type', 'submit')
    userCancel.innerText = 'CANCEL';
    userCancel.id="cancel_button";
    userCancel.setAttribute('type', 'button')

    questionSection.appendChild(formElement);
    formElement.appendChild(prompt);
    formElement.appendChild(userInput);
    formElement.appendChild(userSubmit);
    formElement.appendChild(userCancel);

    addEventListenersForUserForm();

}

function cancelUserSubmission(){
    tearDown();
}

function changeScore(amount){
    score += amount;
}

function correctGuess(){
    changeScore(1);
    announceFeedback('Correct');
}

function endGame(){
    tearDown();
    clearInterval(timer);
    // reset timer display to empty
    timerElement.textContent = "";
    logUserScore();
    // reactivate the start button
    startBtn.disabled = false;
    endBtn.disabled = true;
}

function guess(event){
    let choiceIndex = parseInt(event.target.dataset['index'], 10);
    if(choiceIndex === currentQuestion.correctIndex){
        correctGuess();
    } else {
        wrongGuess();
    }
    tearDown();
    nextQuestion();
}

function getUserInitials(){
    buildUserInitialsForm();
    
}

function getUserScores(){
    let scores = localStorage.getItem('userScores');
    return scores;
}

function logUserScore(){
    userInitials = getUserInitials();
    // saveUserScore(userInitials);
}

function displayHighScores(){
    // get the scores from local storage
    let scores = new UserScores();
    scores.load();
    console.log(scores);
    scores.render();
}

function nextQuestion(){
    // increment question and play
    if(currentQuestionIndex < questions.length){
        currentQuestion = questions[currentQuestionIndex]
        currentQuestion.render();
        currentQuestionIndex += 1;
    // condition that end of questions has been reached
    } else {
        endGame();
    }
}

function prepareGame(){
    // add event listeners to game page
    startBtn.addEventListener('click', startGame);
    endBtn.addEventListener('click', endGame); 
    // build question objects
    buildQuestions();
}

function removeEventListenersForAnswerButtons(){
    // add event listener to buttons created
    let buttonElements = document.querySelectorAll('.answer_button');
    for(let i=0; i<buttonElements.length; i++){
        buttonElements[i].removeEventListener('click', guess);
    }
}

function saveUserScore(initials){
    // let userScore = {'initials': initials, 'score': score};
    localStorage.setItem(initials, score);
    console.log('saved user initials', initials);
}

function startGame(event){ 
    startBtn.disabled = true;
    endBtn.disabled = false;
    startTimer();
    nextQuestion();
}

function startTimer(){

    timer = setInterval(function(){
        timerValue --;
        timerElement.textContent = timerValue;

        // condition to break countdown
        if (timerValue === 0){
            // lost the game due to timeout
            endGame();
    }}, 1000)
}

function submitUserForm(event){
    let user_initials = event.target.form[0].value;
    saveUserScore(user_initials);
    tearDown();
}

function tearDown(){
    removeEventListenersForAnswerButtons();
    questionSection.textContent = "";
    answerSection.textContent = "";
}

function wrongGuess(){
    // this is a placeholder if you want to do punishment errors
    changeScore(0);
    timer -= 5;
    announceFeedback('Wrong, the answer was: '+currentQuestion.answers[currentQuestion.correctIndex]);
}
