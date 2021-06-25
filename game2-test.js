// RUNTIME

// test build questions
function testBuildQuestions(){
    console.log('\tTESTING-buildQuestions')
    let game = new Game();
    game.buildQuestions();
    // console.log(game.questions);
    if (game.questions.length == 2){
        console.log('TEST PASSED');
    } else {
        console.log('TEST FAILED');
        console.log('questions array is: ', game.questions);
    }

}

// test load high scores
function testSaveAndLoadScores(){
    console.log('\tTESTING-loadScores')
    let scores = new Score();
    scores.load();
    // scores.logResults();
    // console.log('There should be no results');
    scores.updateCurrentScore('save1', 6);
    scores.save();
    scores.load();
    // scores.logResults();
    // console.log('There should be one result called save1 = 6');
    if (scores.results[0].initials === 'save1' && scores.results[0].score === 6){
        console.log('TEST PASSED');
    } else {
        console.log('TEST FAILED');
        console.log('result was:', game.results);
    }
    // teardown
    scores.resetLocalMemory();
}

// test score sort
function testSortScore(){
    let test_passed = true;
    console.log('\tTESTING-sortScore')
    let scores = new Score();
    scores.updateCurrentScore('script_sortB', 3);
    scores.addCurrentToResults();
    scores.updateCurrentScore('script_sortA', 7);
    scores.addCurrentToResults();
    scores.updateCurrentScore('script_sortC', 11);
    scores.addCurrentToResults();
    // scores.logResults();
    // console.log('sorting descending now');
    scores.sortDesc();
    // scores.logResults();
    for (let i = 0; i < scores.results.length-1; i++){
        if (scores.results[i].score < scores.results[i+1].score){
            // console.log('Sort Failed: ',scores.results[i].score,'Should be larger than',scores.results[i+1].score);
            test_passed = false;
        } 
    }
    if (!test_passed){
        console.log('TEST FAILED');
    } else {
        console.log('TEST PASSED');
    }
    // teardown
    scores.resetLocalMemory();
}

// test reset memory
function testResetLocalMemory(){
    console.log('\tTESTING-resetMemory')
    let scores = new Score();
    scores.updateCurrentScore('test-delete', 6);
    scores.updateCurrentScore('test-current', 6);
    // console.log('saving data');
    scores.save();
    scores.load();
    // console.log('printing local data, should have "test-delete" and "test-current" in it');
    // scores.logResults();
    // console.log('resetting data');
    scores.resetLocalMemory();
    // scores.logResults();
    // console.log('Should have removed test-delete and re-added test-current');
    if(scores.results[0].initials === "test-current" && scores.results[0].score === 6){
        console.log('TEST PASSED');
    } else {
        console.log('TEST FAILED');
    }

}