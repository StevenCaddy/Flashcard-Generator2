var BasicCard = function(front, back){
	this.front = front;
	this.back = back;
}


BasicCard.prototype.printCard = function() {
    console.log('Front: ' + this.front + ', ' + 'Back: ' + this.back);
};

BasicCard.prototype.printFront = function() {
    console.log(this.front);

}


BasicCard.prototype.printBack = function() {
    console.log("The correct answer is " + this.back + '.');
}


module.exports = BasicCard; 