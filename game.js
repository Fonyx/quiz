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

// || GLOBAL SETTINGS AND VARIABLES
questions = [];
currentQuestion = new Object;
currentQuestionIndex = 0;
score = 0;
timerValue = 30;

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

// || UTILITIES

// || EVENT HANDLERS
startBtn.addEventListener('click', startGame);
endBtn.addEventListener('click', endGame);

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
    }, 2000)
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

function endGame(event){
    tearDown();
    clearInterval(timer);
    // reset timer display to empty
    timerElement.textContent = "";
    logUserScore();
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

function logUserScore(){
    userInitials = getUserInitials();
    // saveUserScore(userInitials);
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
    buildQuestions();
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
