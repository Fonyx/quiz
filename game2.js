// GLOBALS
debug = false;
feedbackTimeout = 2500;

// ELEMENTS
timerElement = $('#timer_value');
highScoreElement = $('#high_score');
buttonElement = $('#buttons');
gameElement = $('#game');
feedbackElement = $('#feedback');


// || FUNCTIONS
function activateStartButton(){
    let startBtn = $('#start_button');
    let endBtn = $('#end_button');
    startBtn.attr('disabled',false);
    endBtn.attr('disabled', true);
}

function announceFeedback(feedback){

    // reset the feedback if it is still active from last announcement
    feedbackElement.text("");

    // create new feedback element and fill
    let paragraphElement = $('<p>');
    paragraphElement.attr('id',"feedback_text");
    paragraphElement.text(feedback);
    feedbackElement.append(paragraphElement);

    // append and set to empty once timeout
    setTimeout(function (){
        feedbackElement.text("");
    }, feedbackTimeout)
}

function buildQuestions(){
    questions = [];

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
    let formElement = $('<form>');
    let prompt = $('<h2>');
    let userInput = $('<input>');
    let userSubmit = $('<button>');
    let userCancel = $('<button>');

    prompt.text('Add initials to store your score');
    userInput.attr('id', 'user_input');
    userSubmit.text('SAVE');
    userSubmit.attr('id','submit_button');
    userSubmit.attr('type', 'submit')
    userCancel.text('CANCEL');
    userCancel.attr('id','cancel_button');
    userCancel.attr('type', 'button')

    gameElement.append(formElement);
    formElement.append(prompt);
    formElement.append(userInput);
    formElement.append(userSubmit);
    formElement.append(userCancel);

    // add event listeners
    userSubmit.on('click', submitUserForm);
    userCancel.on('click', cancelUserSubmission);
}

function cancelUserSubmission(){
    announceFeedback('Ok keep your secrets');
    drawGameStart();
}

function clearTimer(){
    clearInterval(timer);
    // clear the timer display
    timerElement.text(0);
}

function deactivateStartButton(){
    let startBtn = $('#start_button');
    let endBtn = $('#end_button');
    startBtn.attr('disabled',true);
    endBtn.attr('disabled',false);
}

function drawActiveQuestion(){

    // reset game element
    highScoreElement.text("");
    gameElement.text("");

    currentQuestion = questions[activeQuestionIndex]

    // render question
    let questionElement = $('<h2>');
    questionElement.attr('id',"question_text");
    questionElement.text(currentQuestion.question);
    gameElement.append(questionElement);

    // render answers as buttons
    for(let i = 0; i<currentQuestion.answers.length; i++){
        let answerButton = $('<button>')
        answerButton.attr('class',"answer_button");
        answerButton.attr('data-index',i);
        answerButton.text(currentQuestion.answers[i]);
        gameElement.append(answerButton);
    }

    // add event listener to buttons created
    let buttonElements = $('.answer_button');
    buttonElements.on('click', guess)

}

function drawGameStart(){
    // reset highscore game and button element
    highScoreElement.text("");
    gameElement.text("");
    buttonElement.text("");
    
    // create start and stop buttons
    let startBtn = $('<button>');
    let endBtn = $('<button>');

    // set initial properties of buttons
    startBtn.attr('type','button');
    startBtn.attr('id','start_button');
    startBtn.text("START");
    endBtn.attr('type','button');
    endBtn.attr('id','end_button');
    endBtn.text("END");

    // attach buttons to button_section
    buttonElement.append(startBtn);
    buttonElement.append(endBtn);

    // add event listeners to buttons
    startBtn.on('click', startGame);
    endBtn.on('click', exitGame);

    // set active states for buttons
    activateStartButton();

}

function exitGame(){
    console.log('You left the game early');
    activateStartButton();
    clearTimer();
    buttonElement.text("");
    drawGameStart();
}

function gameTimeout(){
    console.log('Game timed out');
    activateStartButton();
    clearTimer();
    buttonElement.text("");
    drawGameStart();
}

function guess(event){
    let choiceIndex = parseInt(event.target.dataset['index'], 10);
    // if guessed correctly
    if(choiceIndex === currentQuestion.correctIndex){
        currentScore += 1;
        announceFeedback('Correct');
    } else {
        // this is a placeholder if you want to do punishment errors
        // currentScore --;
        timeLimit -= 5;
        announceFeedback('Wrong, the answer was: '+currentQuestion.answers[activeQuestionIndex]);
    }
    
    if (activeQuestionIndex < questions.length-1){
        activeQuestionIndex += 1;
        drawActiveQuestion();
    } else {
        winGame();
    }
    
}

function showHighScores(){
    // load results
    let recordedScores = new Score();
    recordedScores.load();

    // reset in case of double load
    highScoreElement.text("");
    buttonElement.text("");

    // flag for empty result case
    let empty = true;

    // make reset button
    let resetButton = $('<button>');
    resetButton.attr("id", "reset_scores_button");
    resetButton.text("Reset leaderboard");
    resetButton.on('click', function(){
        recordedScores.resetLocalMemory();
        showHighScores();
    });
    highScoreElement.append(resetButton);

    // make table elements
    let playerBoard = $('<div>');
    let playerTable = $('<table>');
    let tableHeader = $('<tr>');
    let tableD1 = $('<td>');
    let tableUsername = $('<h2>');
    let tableD2 = $('<td>');
    let tableScore = $('<h2>');

    // modify classes and id's
    playerBoard.attr("id", "player_board");
    playerTable.attr("id", "player_table");
    tableHeader.attr("id", "table_header");

    // add text to table data elements
    tableUsername.text("Initials");
    tableScore.text("Score");

    // build table structure
    highScoreElement.append(playerBoard);
    playerBoard.append(playerTable);
    playerTable.append(tableHeader);
    tableD1.append(tableUsername);
    tableHeader.append(tableD1);
    tableD2.append(tableScore);
    tableHeader.append(tableD2);

    // populate high scores from local data
    for(let i =0; i<recordedScores.results.length; i++){
        // create table row element
        let tableRow = $('<tr>');

        // define row properties
        tableRow.attr('data-index', i);
        tableRow.attr("class","highscore_row");

        // create table data elements and set class names
        let tableDataInitial = $('<td>');
        tableDataInitial.attr("class", "table_data_initial");
        let tableDataScore = $('<td>');
        tableDataScore.attr("class", "table_data_score");

        // insert data
        tableDataInitial.text(recordedScores.results[i].initials);
        tableDataScore.text(recordedScores.results[i].score);

        // attach table data to row
        tableRow.append(tableDataInitial);
        tableRow.append(tableDataScore);
        // attach table row to table
        playerTable.append(tableRow);
        // set so we know results were printed
        empty = false;
    }
    // if no results were printed
    if(empty){
        // create announcement node to display that no results were rendered
        let announcement = $('<h3>');
        // add announcement text
        announcement.text('No results found in local storage');
        // get parent div of the table
        let tablePlayerBoard = $('#player_board');
        tablePlayerBoard.append(announcement);
    }
    
}

function startGame(){
    buildQuestions();
    // set timer start
    timeLimit = 30;
    timerElement.text(timeLimit);
    // make new score object
    scoreRecord = new Score();
    currentScore = 0;
    activeQuestionIndex = 0;

    startTimer();
    deactivateStartButton();
    drawActiveQuestion();
}

function startTimer(){

    // set timer as a global
    timer = setInterval(function(){
        timeLimit --;
        timerElement.text(timeLimit);
        console.log('Time remaining: ', timeLimit);
        // condition to break countdown
        if (timeLimit <= 0){
            clearTimer();
            // lost the game due to timeout
            gameTimeout();
    }}, 1000)
}

function submitUserForm(event){
    let user_initials = event.target.form[0].value;
    scoreRecord.load();
    scoreRecord.updateCurrentScore(user_initials, currentScore);
    scoreRecord.save();
    console.log('saved user initials', user_initials);
}

function winGame(){
    announceFeedback('You scored: '+currentScore+' out of: '+ questions.length);
    console.log('You won the game');
    clearTimer();

    // reset game and button element
    gameElement.text("");
    buttonElement.text("");

    // load user initials form for entry
    buildUserInitialsForm();
}

class Question{
    constructor(question, answers, correctIndex){
        this.question = question;
        this.answers = answers;
        this.correctIndex = correctIndex;
        this.choiceIndex = undefined;
        this.correct = false;
    }
}

class Score{
    // construct score with initials: value
    constructor(){
        this.memoryName = 'userScores';
        this.results = [];
        this.current_initial = '';
        this.current_score = 0;
    }
    // function that adds the current initial and score to the results list
    addCurrentToResults(){
        if (this.current_initial !== ""){
            this.results.push({'initials':this.current_initial, 'score': this.current_score});
        }
    }

    // function that loads all scores from storage object
    load(){
        // reset results list and initialize with current intials
        this.results = [];
        // get results from the save store
        let memoryAsString = localStorage.getItem(this.memoryName)
        let loadedResults = JSON.parse(memoryAsString);
        if (loadedResults){
            // add the results from local storage to results list
            this.results = loadedResults;
        } else {
            // if object has no records in memory
            if (debug){
                console.log('No result found in local storage');
            }
        }
    }

    // log
    logResults(){
        console.log(this.results);
    }

    // function that adds a new score to the results list
    updateCurrentScore(initials, score){
        if (initials !== ""){
            this.current_initial = initials;
            this.current_score = score;
        } else{
            console.log('was requested to update current initials to "", did not do it');
        }
    }

    // reset local memory
    resetLocalMemory(){
        localStorage.clear();
        console.log('reset local storage was complete');
        this.results = [];
        // if there was a current working result, add it again after reset
        if (this.current_initial !== ""){
            this.updateCurrentScore(this.current_initial, this.current_score);
        }
        this.addCurrentToResults();
    }

    // saves results list to local storage
    save(){
        // stick the current value into the results and save
        this.addCurrentToResults();
        localStorage.setItem(this.memoryName, JSON.stringify(this.results));
    }

    // sorts results list according to score value, either ascending or descending
    sortDesc(){
        this.results.sort(compareDesc);
    }

}

// UTILITIES
function compareDesc(a, b){
    if (a.score > b.score){
        return -1
    } else if (a.score < b.score){
        return 1
    } else {
        return 0
    }
}
