// || DOCUMENT ELEMENTS
// local storage
let localStorage = window.localStorage;
// main div
let main = document.querySelector('main');
// // timer
let timerElement = document.querySelector('#timer_value');


// set globals for game
questions = [];
currentQuestion = new Object;
currentQuestionIndex = 0;
score = 0;
// timerValue = 30;
feedbackTimeout = 2000;

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

        let questionSection = document.querySelector('#question');
        let answerSection = document.querySelector('#answers');

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

        // add event listener to buttons created
        let buttonElements = document.querySelectorAll('.answer_button');
        for(let i=0; i<buttonElements.length; i++){
            buttonElements[i].addEventListener('click', guess);
        }
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
        let memoryAsString = localStorage.getItem('userScores')
        let loadedResults = JSON.parse(memoryAsString);
        if (loadedResults){
            this.results = loadedResults;
        } else {
            // if object has no records in memory, start it off as empty
            console.log('No result found in local storage, results are empty');
            this.results = [];
        }
    }

    render(){
        // flag for empty result case
        let empty = true;
        // make sure we aren't just appending to the list
        clearMainTag();

        // make reset button
        let resetButton = document.createElement('button');
        resetButton.id="reset_scores_button";
        resetButton.innerText = "Reset leaderboard";
        resetButton.addEventListener('click', resetLocalMemory);
        main.appendChild(resetButton);

        // make table elements
        let playerBoard = document.createElement('div');
        let playerTable = document.createElement('table');
        let tableHeader = document.createElement('tr');
        let tableD1 = document.createElement('td');
        let tableUsername = document.createElement('h2');
        let tableD2 = document.createElement('td');
        let tableScore = document.createElement('h2');

        // modify classes and id's
        playerBoard.id = "player_board";
        playerTable.id = "player_table";
        tableHeader.id = "table_header";

        // add text to table data elements
        tableUsername.innerText = "Initials";
        tableScore.innerText = "Score";

        // build table structure
        main.appendChild(playerBoard);
        playerBoard.appendChild(playerTable);
        playerTable.appendChild(tableHeader);
        tableD1.appendChild(tableUsername);
        tableHeader.appendChild(tableD1);
        tableD2.appendChild(tableScore);
        tableHeader.appendChild(tableD2);

        // populate high scores from local data
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

            // insert data
            tableDataInitial.innerText = this.results[i].initials;
            tableDataScore.innerText = this.results[i].score;

            // attach table data to row
            tableRow.appendChild(tableDataInitial);
            tableRow.appendChild(tableDataScore);
            // attach table row to table
            playerTable.appendChild(tableRow);
            // set so we know results were printed
            empty = false;
        }
        // if no results were printed
        if(empty){
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

// || RESET FUNCTIONS
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

function clearMainTag(){
    removeEventListenersForStartEndButtons();
    removeEventListenersForGuessButtons();
    removeEventListenersForFormButtons();
    main.textContent = '';
    console.log('cleared main section');
}

function emptyQuestionAnswerSections(){

    let questionSection = document.querySelector('#question');
    let answerSection = document.querySelector('#answers');

    questionSection.textContent = '';
    answerSection.textContent = '';
}

function removeEventListenersForFormButtons(){
    let buttonElements = document.querySelectorAll('form button');
    for(let i=0; i<buttonElements.length; i++){
        buttonElements[i].removeEventListener('click', submitUserForm);
        buttonElements[i].removeEventListener('click', cancelUserSubmission);
    }  
}

function removeEventListenersForGuessButtons(){
    let buttonElements = document.querySelectorAll('#answers button');
    for(let i=0; i<buttonElements.length; i++){
        buttonElements[i].removeEventListener('click', startGame);
        buttonElements[i].removeEventListener('click', endGame);
    }
}

function removeEventListenersForStartEndButtons(){
    let buttonElements = document.querySelectorAll('#buttons button');
    for(let i=0; i<buttonElements.length; i++){
        buttonElements[i].removeEventListener('click', startGame);
        buttonElements[i].removeEventListener('click', endGame);
    }
}

function resetStartEndButtons(){

    let buttonSection = document.querySelector('#buttons');
    // create buttons
    let startBtn = document.createElement('button');
    let endBtn = document.createElement('button');

    // set initial properties of buttons
    startBtn.type="button";
    startBtn.id = "start_button";
    startBtn.innerText = "START";
    endBtn.type="button";
    endBtn.id = "end_button";
    endBtn.innerText = "END";

    // attach buttons to button_section
    buttonSection.appendChild(startBtn);
    buttonSection.appendChild(endBtn);

    // add event listeners to buttons
    startBtn.addEventListener('click', startGame);
    endBtn.addEventListener('click', endGame);

    // log action
    if(debug){
        console.log('reset start stop buttons');
    }

}

function resetStartScreen(){
    // create divs for main tag
    let buttonsDiv = document.createElement('div');
    let questionDiv = document.createElement('div');
    let answersDiv = document.createElement('div');
    let feedbackDiv = document.createElement('div');
    
    // add id details
    buttonsDiv.id = "buttons";
    questionDiv.id = "question";
    answersDiv.id = "answers";
    feedbackDiv.id = "feedback";

    // append to main
    main.appendChild(buttonsDiv);
    main.appendChild(questionDiv);
    main.appendChild(answersDiv);
    main.appendChild(feedbackDiv);
}

function resetLocalMemory(){
    localStorage.clear();
    scores.load();
    scores.render();
}

function restartGame(){
    
}

// || FUNCTIONS
function activateStartButton(){
    let startBtn = document.querySelector('#start_button');
    let endBtn = document.querySelector('#end_button');

    startBtn.disabled = false;
    endBtn.disabled = true;
}

function announceFeedback(feedback){

    let feedbackSection = document.querySelector('#feedback');
    // reset the feedback if it is still active from last announcement
    feedbackSection.textContent = "";

    // create new feedback element and fill
    let feedbackElement = document.createElement('p')
    feedbackElement.id = "feedback_text";
    feedbackElement.innerText = feedback;
    feedbackSection.appendChild(feedbackElement);

    // append and set to empty once timeout
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

    main.appendChild(formElement);
    formElement.appendChild(prompt);
    formElement.appendChild(userInput);
    formElement.appendChild(userSubmit);
    formElement.appendChild(userCancel);

    // add event listeners
    userSubmit.addEventListener('click', submitUserForm);
    userCancel.addEventListener('click', cancelUserSubmission);
}

function cancelUserSubmission(){
    clearMainTag();
    resetStartScreen();
    resetStartEndButtons();
}

function deactivateStartButton(){
    let startBtn = document.querySelector('#start_button');
    let endBtn = document.querySelector('#end_button');

    startBtn.disabled = true;
    endBtn.disabled = false;
}

function endGame(){
    clearInterval(timer);
    // reset timer display to empty
    timerElement.textContent = "";
    clearMainTag();
    emptyQuestionAnswerSections();
    resetStartScreen();
    resetStartEndButtons();
}

function guess(event){
    let choiceIndex = parseInt(event.target.dataset['index'], 10);
    if(choiceIndex === currentQuestion.correctIndex){
        score ++;
        announceFeedback('Correct');
    } else {
        // this is a placeholder if you want to do punishment errors
        // score --;
        timerValue -= 5;
        announceFeedback('Wrong, the answer was: '+currentQuestion.answers[currentQuestion.correctIndex]);
    }
    nextQuestion();
}

function getUserScores(){
    let scores = localStorage.getItem('userScores');
    return scores;
}

function loseGame(){
    clearMainTag();
    clearInterval(timer);
    // reset timer display to empty
    timerElement.textContent = "";
    resetStartScreen();
    resetStartEndButtons();
}

function nextQuestion(){
    // empty question and answer section text
    emptyQuestionAnswerSections();

    // increment question and play
    if(currentQuestionIndex < questions.length){
        currentQuestion = questions[currentQuestionIndex]
        currentQuestion.render();
        currentQuestionIndex += 1;
    // condition that end of questions has been reached
    } else {
        winGame();
    }
}

function outputScore(){
    let output = document.createElement('h3');
    output.innerText = 'You scored: '+score+' out of: '+ questions.length;
    output.id = "score_output";
    main.appendChild(output);
}

function prepareGame(){
    // init globals for game
    questions = [];
    currentQuestion = new Object;
    currentQuestionIndex = 0;
    score = 0;
    timerValue = 30;
    feedbackTimeout = 2000;
    debug = true;
    scores = new UserScores();
    clearMainTag();
    resetStartScreen();
    resetStartEndButtons();
    activateStartButton();
    buildQuestions();
}

function showHighScores(){
    // get the scores from local storage
    scores.load();
    console.log(scores);
    scores.render();
}

function startGame(){ 
    deactivateStartButton();
    startTimer();
    nextQuestion();
}

function startTimer(){

    let timerValue = 30;

    timer = setInterval(function(){
        timerValue --;
        timerElement.textContent = timerValue;

        // condition to break countdown
        if (timerValue === 0){
            // lost the game due to timeout
            loseGame();
    }}, 1000)
}

function submitUserForm(event){
    let user_initials = event.target.form[0].value;
    scores.addScore(user_initials, score);
    scores.save();
    console.log('saved user initials', user_initials);
    clearMainTag();
    resetStartScreen();
    resetStartEndButtons();
}

function winGame(){
    endGame();
    outputScore();
    buildUserInitialsForm();
}