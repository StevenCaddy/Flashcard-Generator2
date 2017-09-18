var inquirer = require('inquirer');
var fs = require('fs');
var loop = 0;
var frontCard = [];
var backCard = [];

function BasicCard(front, back){
	this.front = front;
	this.back = back;
	this.printInfo = function(){
		console.log("Question: "+this.front+"\nAnswer: "+this.back);
	}
}

var getFront = function(){
	if (loop < 2){
		inquirer.prompt([{
			name:"front",
			message:"Enter the question for this card: "
		},{
			name:"back",
			message:"Enter the answer for the card: "
		}]).then(function(answers){
			var newCard = new BasicCard(answers.front, answers.back);
			newCard.printInfo();
			loop++;
			getFront();
		})
	} 
}

getFront();



module.exports = BasicCard; 