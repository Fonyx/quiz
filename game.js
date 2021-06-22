// || DOCUMENT ELEMENTS
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
function startGame(event){
    buildQuestions();
    startTimer();
    nextQuestion();
}

function endGame(event){
    tearDown();
}

function nextQuestion(){
    // increment question
    currentQuestion = questions[currentQuestionIndex]
    currentQuestion.render();
    currentQuestionIndex += 1;
}

function guess(event){
    let choiceIndex = parseInt(event.target.dataset['index'], 10);
    if(choiceIndex === currentQuestion.correctIndex){
        correctGuess();
    } else {
        wrongGuess()
    }
    tearDown();
    nextQuestion();
}

function correctGuess(){
    changeScore(1);
    announceFeedback('Correct');
}

function wrongGuess(answer){
    // this is a placeholder if you want to do punishment errors
    changeScore(0);
    announceFeedback('Wrong, the answer was: '+currentQuestion.answers[currentQuestion.correctIndex]);
}

function announceFeedback(feedback){
    let feedbackElement = document.createElement('p')
    feedbackElement.className = "feedback_text";
    feedbackElement.innerText = feedback;

    setInterval(function (){
        feedbackSection.appendChild(feedbackElement);
    }, 2000)
}

function addEventListenersForAnswerButtons(){
    // add event listener to buttons created
    let buttonElements = document.querySelectorAll('.answer_button');
    for(let i=0; i<buttonElements.length; i++){
        buttonElements[i].addEventListener('click', guess);
    }
}

function removeEventListenersForAnswerButtons(){
    // add event listener to buttons created
    let buttonElements = document.querySelectorAll('.answer_button');
    for(let i=0; i<buttonElements.length; i++){
        buttonElements[i].removeEventListener('click', guess);
    }
}

function changeScore(amount){
    score += amount;
}

function tearDown(){
    removeEventListenersForAnswerButtons();
    questionSection.textContent = "";
    answerSection.textContent = "";
}

function startTimer(){

    timer = setInterval(function(){
        timerValue --;
        timerElement.textContent = timerValue;

        // conditions to break countdown
        if (timerValue === 0){
            clearInterval(timer);
            // lost the game due to timeout
    }}, 1000)
}

function buildQuestions(){
    questions.push(new Question(
        'How many?', ['Too many', 'Not enough', 'Just right', 'Other'], 2
    ));
    questions.push(new Question(
        'Why?', ['Because', 'Because Why Not', 'Because I said so', 'Do it!'], 3
    ));
}