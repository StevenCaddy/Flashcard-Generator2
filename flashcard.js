var inquirer = require('inquirer');
var fs = require('fs');
var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");


const flashcards = () => {

        inquirer.prompt([{

                type: 'list',
                name: 'userType',
                message: 'What would you like to do?',
                choices: ['create-basic-cards', 'create-cloze-cards', 'basic-quiz', 'cloze-quiz', 'quit']
            }

        ]).then(function(choice) {

            if (choice.userType === 'create-basic-cards') {
                readCards('log.txt');
                createCards(basicPrompt, 'log.txt');
            } else if (choice.userType === 'create-cloze-cards') {
                readCards('clozelog.txt');
                createCards(clozePrompt, 'clozelog.txt');
            } else if (choice.userType === 'basic-quiz') {
                study('log.txt', 0);
            } else if (choice.userType === 'cloze-quiz') {
                study('clozelog.txt', 0);
            } else if (choice.userType === 'quit') {
            	return;
            }
        });
    }

 const readCards = (logFile) => {
    cardArray = [];
    fs.readFile(logFile, "utf8", function(error, data) {

        var jsonContent = JSON.parse(data);

        for (let i = 0; i < jsonContent.length; i++) {
            cardArray.push(jsonContent[i]);
        }
    });
};

const createCards = (promptType, logFile) => {

    inquirer.prompt(promptType).then(function(answers) {

        cardArray.push(answers);

        if (answers.makeMore) {

            createCards(promptType, logFile);
        } else {

            writeToLog(logFile, JSON.stringify(cardArray));
            flashcards();
        }
    });
};

const study = (logFile, x) => {

    fs.readFile(logFile, "utf8", function(error, data) {

        var jsonContent = JSON.parse(data);

        if (x < jsonContent.length) {

            if (jsonContent[x].hasOwnProperty("front")) {

                var gameCard = new BasicCard(jsonContent[x].front, jsonContent[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else {
                var gameCard = new ClozeCard(jsonContent[x].text, jsonContent[x].cloze);
                var gameQuestion = gameCard.message;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }

            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {

                    if (value.length > 0) {
                        return true;
                    }
                    return 'Come on, at least take a guess!';
                }

            }]).then(function(answers) {

                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log('Correct!');
                    x++;
                    study(logFile, x);
                } else {
                    console.log("The correct answer is " + gameAnswer);
                    x++;
                    study(logFile, x);
                }

            })

        } else {
            flashcards();
        }
    });
};

const writeToLog = (logFile, info) => {

    fs.writeFile(logFile, info, function(err) {
        if (err)
            console.error(err);
    });
}

const basicPrompt = [{
    name: "front",
    message: "Enter Front of Card: "
}, {
    name: "back",
    message: "Enter Back of Card: "

}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card?',
    default: true
}]

const clozePrompt = [{
    name: "text",
    message: "Enter a sentence, putting the word you want to hide in parentheses: blah blah (blah)",
    validate: function(value) {
        var parentheses = /\(\w.+\)/;
        if (value.search(parentheses) > -1) {
            return true;
        }
        return 'Please put a word in your sentence in parentheses'
    }
}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card?',
    default: true
}]

const makeMore = {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card?',
    default: true
}

flashcards();