// GLOBALS
debug = false;
let timerValue = 30;


// local storage methods

// document methods
    // building
    
    // clearing
    
    // rendering

// state methods
function gameTimeout(){
    console.log('Game timed out');
}

function winGame(){
    console.log('You won the game');
}

function exitGame(){
    console.log('You left the game early');
}

// timer methods
function startTimer(){
    let timer = setInterval(function(){
        timerValue --;
        this.timerElement.textContent = timerValue;

        // condition to break countdown
        if (this.timerValue === 0){
            // lost the game due to timeout
            gameTimeout();
    }}, 1000)
}

// question methods
function buildQuestions(){
    this.questions.push(new Question(
        'How many?', ['Too many', 'Not enough', 'Just right', 'Other'], 2
    ));
    this.questions.push(new Question(
        'Why?', ['Because', 'Because Why Not', 'Because I said so', 'Do it!'], 3
    ));
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

function startGame(){
    runTests();
}

function runTests(){
    testScoreResetLocalMemory(); // works 
    testQuestionBuildQuestions(); // works 
    testScoreSaveAndLoad(); // works 
    testScoreSort(); // works 
    testGameStartTimer(); //
}