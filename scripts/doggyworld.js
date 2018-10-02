//https://stackoverflow.com/questions/962033/what-underlies-this-javascript-idiom-var-self-this

var doggyworldGame = function() {
    var self=this;
    this.landmarks=[];
    this.options={
        //not sure what we will or won't need for options, left as example of what should go here
        /*height:500,
        width:680,
        goalHeight:188,
        goalRight:50,
        goalWidth:50,
        minRange:600,
        minX:50,
        minY:100,
        mindelay:1000,
        maxdelay:5000,
        minballSpeed:70,
        maxballSpeed:150,
        errorPercent:1.25,
        goalieHeight:60*/

        //for the grid
        minX: 0,
        minY: 0,
        maxX: 9,
        maxY: 9,
        
        //speed of tick - 1000 is about one second.
        speed: 1000,
		//wait time between player actions
		playerDelay: 500,
        icounter: 0,
		

    }
	
	//0 is quit or unstarted, 1 is unpaused or playing, 2 is paused
	this.gameState = 0;
	
    this.height = 500;
    this.time = 0;
	
	this.UI = undefined;
	

    //im making a lot of arbitrary decisions
    this.setCharacters=function() {
        self.plain = "grass"; //not sure if we'll want to do something else later, otherwise I'd change this to a string
        
        self.landmarks = [new landmark(1, 1, 7, 0, ""), new landmark(2, 1, 7, 2, ""), new landmark(3, 1, 9, 4, ""), new landmark(4, 1, 6, 3, ""),  
            new landmark(5, 2, 2, 9, ""), new landmark(6, 2, 2, 7, ""), new landmark(7, 2, 0, 5, ""), new landmark(8, 2, 3, 6, ""),
            new landmark(9, 3, 9, 7, ""), new landmark(10, 3, 7, 7, ""), new landmark(11, 3, 6, 9, ""), new landmark(12, 3, 6, 6, "")];
        self.kennels = [new kennel(0, 0, 0), new kennel(1, 9, 0), new kennel(2, 0, 9), new kennel(3, 9, 9)];
        
        
        self.landmarksAI1 = [];
        self.landmarksAI2 = [];
        self.landmarksAI3 = [];
        for (var i = 0; i < self.landmarks.length; i++){
            if(self.landmarks[i].originalowner == 1){
                self.landmarksAI1.push(self.landmarks[i]);
            }
            else if(self.landmarks[i].originalowner == 2){
                self.landmarksAI2.push(self.landmarks[i]);    
            }
            else if(self.landmarks[i].originalowner == 3){
                self.landmarksAI3.push(self.landmarks[i]); 
            }
        }
        
        self.player=new dogPlayer(1,0,self.options.minY,self.options.maxY,self.options.minX,self.options.maxX, self.landmarks);
        self.dogAI1=new dogAI(1, 0, 8, 0, 4, 5, 9, self.landmarksAI1);
        self.dogAI2=new dogAI(2, 9, 1, 5, 9, 0, 4, self.landmarksAI2);
        self.dogAI3=new dogAI(3, 9, 8, 5, 9, 5, 9, self.landmarksAI3);
       
        self.dogs = [self.player, self.dogAI1, self.dogAI2, self.dogAI3];

        
        self.board = [new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10)];
        self.board.forEach(function(subarray) {
            subarray.fill(self.plain);
        });
        self.landmarks.forEach(function(alandmark) {
            self.board[alandmark.yPosition][alandmark.xPosition] = alandmark;
        });
        
        self.kennels.forEach(function(akennel) {
            self.board[akennel.yPosition][akennel.xPosition] = akennel;
        });
        
        self.dogs.forEach(function(adog) {
            self.board[adog.yPosition][adog.xPosition] = adog;
        });
    }
   
    
    /*
    this.reset_board=function(time){
        
    };
    */

    
    this.initialize=function(){
		self.UI = new doggyworldUI();
        self.reset();
		
		//timer - ticks up constantly, increments game clock if game is unpaused
        setInterval(function () { 
            //if running? TODO
                self.update();
            //end if
        }, self.options.speed);
		
        self.setCharacters();
    };

    this.reset=function(){
        //put all dogs back in their kennels
        //make all territories owned by the correct dogs

        //may generate/regenerate board
        
        //reset time to 0
        self.time = 0;
		//self.gameState = 0;
		self.setCharacters();
    };
	
	$('#StartBtn').on('click',function(){
		$('#GameStopped').hide();
		$('#GameRunning').show();
		$('#playBoard').show()
		$('#Status').text('Go!');
		self.gameState = 1; //running
		self.UI.running=true;
		self.UI.refreshView();
	});

	$('#PauseBtn').on('click',function(){
		$('#GameStopped').show();
		$('#GameRunning').hide();
		$('#playBoard').show();
		$('#Status').text('Game paused...');
		self.gameState = 2; //paused
		self.UI.running=false;
		self.UI.refreshView();
	});
        
	$('#ResetBtn').on('click',function(){
		$('#GameStopped').show();
		$('#GameRunning').hide();
		$('#playBoard').hide();
		$('#Status').text('Click to start!');
		self.gameState = 0; //reset or pre-running
		self.time = 0;
		self.UI.running=false;
		self.reset();
		self.UI.refreshView();
		self.time = 0;
	//	document.querySelector('#Time').innerHTML = '<span>' + (self.time/self.speed) + 'sec</span>';
	});
	/*
	$('#ResetBtn').on('click',function(){
            self.time = 0;
	});
	*/
    
        //moves a specific character on the board - player or ai.
    this.moveOnBoard=function(item) {
        self.board.forEach(function(subarray, index) {
            if (subarray.includes(item)) {
                //take current dog location, write plain to it.
                subarray.forEach(function(element, index2) {
                    if (element == item) {
                        self.board[index][index2] = self.plain;
                        if ((self.board[item.yPosition][item.xPosition] == self.plain) && (self.gameState == 1)) {
                            //if nothing there and it's okay to move (game is running), put it there
                            self.board[item.yPosition][item.xPosition] = item;
                        } else {
                            //don't do anything to board for now, put them back where they were.
                            item.xPosition = index2;
                            item.yPosition = index;
                            self.board[item.yPosition][item.xPosition] = item;
                        }
                    }
                });
                
            } 
        }); 
        
    };
    
    //update all the ai dog's positions and on the board.
    this.update=function(){
		
		//increment timer
		if (self.UI.running == true) {
			self.time++;
		}
		
        //update time on board - should we have game running bool in here, not ui?
        document.querySelector('#Time').innerHTML = '<span>' + self.time + 'sec</span>'; //display time
        
		console.log(self.UI.playerInput);
		
		//player/AI must wait some time after an action before they can start another
	//	if(self.player.canMove === false) {
	//		self.UI.playerInput = undefined;
	//	}
		//if((self.player.canMove === true)&&(self.UI.playerInput != undefined)){
		if(self.UI.playerInput === 'w'){
			self.player.moveV(-1);
		}
		if(self.UI.playerInput === 'a'){
			self.player.moveH(-1);
		}
		if(self.UI.playerInput === 's'){
			self.player.moveV(1);
		}
		if(self.UI.playerInput === 'd'){
			self.player.moveH(1);
		}
		if(self.UI.playerInput === 'e'){
		    self.player.pee();
		}
		self.moveOnBoard(self.player);
	//		self.player.canMove = false;
	    self.UI.playerInput = undefined;
			//setTimeout(function(){self.player.canMove = true;}, self.options.playerDelay);
	//	}
		
		
		
		//passing in player to keep track of location
        self.dogAI1.move(self.player); 
        self.dogAI2.move(self.player);
        self.dogAI3.move(self.player);
        self.moveOnBoard(self.dogAI1);
        self.moveOnBoard(self.dogAI2);
        self.moveOnBoard(self.dogAI3);
        

		self.UI.refreshView(self.board, self.plain, self.player, self.dogs, self.kennels);

    };

    this.initialize();
}

/*
    Dog Player: starting position, range of where it can go.
*/
var dogPlayer = function(xPos,yPos,minY,maxY,minX, maxX, landmarks) {
    //do they need landmarks? other dogs won't attack I think
    var self=this;
    this.dogID = 0;
    this.yPosition=yPos;
    this.xPosition=xPos;
    this.minY=minY;
    this.maxY=maxY;
    this.minX=minX;
    this.maxX=maxX;
    this.landmarks=landmarks;
	this.canMove = true;

    this.initialize=function(){
        
    };
	
	//check for input, returns input if available or returns undefined
	this.checkInput=function(){
		return self.UI.playerInput;//is this function even good practice? it replaces a 1 line piece of code with a 1 line function call....
	}
	
    //after this is called you must update game board
    this.setXPosition=function(newXPos){
        if (newXPos<=self.minX) { //less than or equal to its x bounds
            self.xPosition=self.minX;
        } else if (newXPos>=self.maxX){ //greater than or equal to its x bounds
            self.xPosition=self.maxX;
        } else {
            self.xPosition=newXPos;
        }
    }

    //after this is called you must update game board
    this.setYPosition=function(newYPos){
        if (newYPos<=self.minY) {
            self.yPosition=self.minY;
        } else if (newYPos>=self.maxY){
            self.yPosition=self.maxY;
        } else {
            self.yPosition=newYPos;
        }
    };
    this.moveH=function(amount){
        self.setXPosition(self.xPosition+amount);
    };
    
    this.moveV=function(amount){
        self.setYPosition(self.yPosition+amount);
    };

    this.bark=function() {
        
    };

    this.barkedAt=function() {
        self.moveH(-1);
        self.moveV(-1);
    };
    
    this.pee=function() {
<<<<<<< HEAD
        var x;
        document.getElementById("Landmark1").innerHTML = self.landmarks[0].xPosition;
        for(x=0; x<self.landmarks.length; x++) {
=======
        //document.getElementById("Landmark1").innerHTML = "USER PEE";
        for(var x = 0; x < self.landmarks.length; x++) {
>>>>>>> 134c0f27034cc268c22fdaadec02eba4291e91b9
            //if player is next to landmark
             if ((((self.xPosition == (self.landmarks[x].xPosition + 1))||(self.xPosition == (self.landmarks[x].xPosition - 1))) && (self.yPosition == self.landmarks[x].yPosition)) || 
               (((self.yPosition == (self.landmarks[x].yPosition + 1))||(self.yPosition == (self.landmarks[x].yPosition - 1))) && (self.xPosition == self.landmarks[x].xPosition))) {
                 //if the landmark is not claimed, claim it
                 if ((self.landmarks[x].owner) != self.dogID) {
                     self.landmarks[x].owner == self.dogID;
                     document.getElementById("Landmark1").innerHTML = "USER PEE";
                     //self.landmarks[x].show();
                 }
             }
        }
    };

    this.initialize();
}

/*
    artificial dog opponents. has an id, position, range (given territory).
*/
var dogAI = function(dogID, yPos, xPos, minY, maxY, minX, maxX, ownedLandmarks) {
    var self=this;
    this.dogID = dogID;
    this.yPosition=yPos;
    this.xPosition=xPos;
    this.minY=minY;
    this.maxY=maxY;
    this.minX=minX;
    this.maxX=maxX;
    this.ownedLandmarks=ownedLandmarks;

    this.checkLandmark = self.ownedLandmarks[0];
	this.canMove = true;
    
    this.miniGrid = [new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10)];
    
    this.options={

    }

    this.initialize=function(){
        self.miniGrid.forEach(function(subarray) {
        subarray.fill(0);
        });
        self.ownedLandmarks.forEach(function(alandmark) {
        self.miniGrid[alandmark.yPosition][alandmark.xPosition] = 1;
        });
    };
    
    

    //after this is called you must update game board
    this.setXPosition=function(xPos){
        if (xPos<=self.minX) {
            self.xPosition=self.minX;
        } else if (xPos>=self.maxX){
            self.xPosition=self.maxX;
        } else {
            self.xPosition=xPos;
        }
    };

    //after this is called you must update game board
    this.setYPosition=function(yPos){
        if (yPos<=self.minY) {
            self.yPosition=self.minY;
        } else if (yPos>=self.maxY){
            self.yPosition=self.maxY;
        } else {
            self.yPosition=yPos;
        }
    };
    
    this.moveH=function(amount){
        self.setXPosition(self.xPosition+amount);
    };
    
    this.moveV=function(amount){
        self.setYPosition(self.yPosition+amount);
    };

    
    this.reverseNum=function(num){
        if(num > 0){
            return(Math.abs(num) * -1);
        }
        else{
            return(Math.abs(num));
        }
    };
    
    this.chaseH=function(chaseX, chaseY, prevX, prevY){
        //if we need to go in x direction, attempt to moveH
        self.moveH(chaseX);
        if(self.miniGrid[self.yPosition][self.xPosition] == 1){
            self.moveH(self.reverseNum(chaseX));
        }
        //if something is in our way, try movement we determined for y
        if(self.xPosition == prevX && self.yPosition == prevY){
            self.moveV(chaseY);
            if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                self.moveV(self.reverseNum(chaseY));
            }
            if(self.xPosition == prevX && self.yPosition == prevY){
                //if y was not zero and we're still stuck, try backing up instead
                if(chaseY != 0){
                    self.moveV(self.reverseNum(chaseY));
                    if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                        self.moveV(chaseY);
                    }
                }
                //if y was zero, try going in either y direction **may get caught in loop**
                else{
                    self.moveV(1);
                    if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                        self.moveV(-1);
                    }
                    if(self.xPosition == prevX && self.yPosition == prevY){
                        self.moveV(-1);
                        if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                            self.moveV(1);
                        }
                    }
                }
                    //last chance to move, back up in direction we decided
                if(self.xPosition == prevX && self.yPosition == prevY){
                    self.moveH(self.reverseNum(chaseX));
                    if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                        self.moveH(chaseX);
                    }
                }        
            }
        }
    }
    
    
    this.chaseV=function(chaseX, chaseY, prevX, prevY){
        //if we need to go in y direction, attempt to moveV
        self.moveV(chaseY);
        if(self.miniGrid[self.yPosition][self.xPosition] == 1){
            self.moveV(self.reverseNum(chaseY));
        }
        //if something is in our way, try movement we determined for x
        if(self.xPosition == prevX && self.yPosition == prevY){
            self.moveH(chaseX);
            if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                self.moveH(self.reverseNum(chaseX));
            }
            if(self.xPosition == prevX && self.yPosition == prevY){
                //if x was not zero and we're still stuck, try backing up instead
                if(chaseX != 0){
                    self.moveH(self.reverseNum(chaseX));
                    if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                        self.moveH(chaseX);
                    }
                }
                //if x was zero, try going in either x direction **may get caught in loop**
                else{
                    self.moveH(1);
                    if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                        self.moveH(-1);
                    }
                    if(self.xPosition == prevX && self.yPosition == prevY){
                        self.moveH(-1);
                        if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                            self.moveH(1);
                        }
                    }
                }
                //last chance to move, back up in direction we decided
                if(self.xPosition == prevX && self.yPosition == prevY){
                    self.moveV(self.reverseNum(chaseY));
                    if(self.miniGrid[self.yPosition][self.xPosition] == 1){
                        self.moveV(chaseY);
                    }
                }
            }
        }
    }
    
    this.chasePlayer=function(dogPlayer){
        //set x movement
        if(self.xPosition < dogPlayer.xPosition){
            self.chaseX = 1;
        }
        else if(self.xPosition > dogPlayer.xPosition){
            self.chaseX = -1;
        }
        else{
            self.chaseX = 0;
        }
        //set y movement
        if(self.yPosition < dogPlayer.yPosition){
            self.chaseY = 1;
        }
        else if(self.yPosition > dogPlayer.yPosition){
            self.chaseY = -1;
        }
        else{
            self.chaseY = 0;
        }  
        //decide which way we need to go to reach player
        if(self.chaseX == 0 && self.chaseY != 0){
            self.chase = "Y";
        }
        else if(self.chaseY == 0 && self.chaseX != 0){
            self.chase = "X";
        }
        //if we need to travel diagonally, pick one at random
        else if(self.chaseX != 0 && self.chaseY != 0){

            if(Math.round(Math.random()) == 1){
                self.chase = "X";
            }
            else{
                self.chase = "Y";
            }
        }
        else{
            return 0;
        }
        self.prevX = self.xPosition;
        self.prevY = self.yPosition;
        
        if(self.chase == "X"){
            self.chaseH(self.chaseX, self.chaseY, self.prevX, self.prevY);
        }
        else if(self.chase == "Y"){
            self.chaseV(self.chaseX, self.chaseY, self.prevX, self.prevY);
        }
    };
    
    this.randomMovement=function(){
        if(Math.round(Math.random()) == 1){
            self.direction = "H";
        }
        else{
            self.direction = "V";
        }
        if(self.direction == "H"){
            if(Math.round(Math.random()) == 1){
                self.moveH(1);
            }
            else{
                self.moveH(-1);
            }
        }

        else{
            if(Math.round(Math.random()) == 1){
                self.moveV(1);
            }
            else{
                self.moveV(-1);
            }                
        }
    }
    
    this.reclaimLandmark=function(mark){
        self.pee(); //in current state, pee is already checking location. If we change that, this needs to check if next to mark first
        if (mark.owner != self.dogID){
                //set x movement
            if(self.xPosition < mark.xPosition){
                self.chaseX = 1;
            }
            else if(self.xPosition > mark.xPosition){
                self.chaseX = -1;
            }
            else{
                self.chaseX = 0;
            }
            //set y movement
            if(self.yPosition < mark.yPosition){
                self.chaseY = 1;
            }
            else if(self.yPosition > mark.yPosition){
                self.chaseY = -1;
            }
            else{
                self.chaseY = 0;
            }  
            //decide which way we need to go to reach player
            if(self.chaseX == 0 && self.chaseY != 0){
                self.chase = "Y";
            }
            else if(self.chaseY == 0 && self.chaseX != 0){
                self.chase = "X";
            }
            //if we need to travel diagonally, pick one at random
            else if(self.chaseX != 0 && self.chaseY != 0){
    
                if(Math.round(Math.random()) == 1){
                    self.chase = "X";
                }
                else{
                    self.chase = "Y";
                }
            }
            else{
                return 0;
            }
            self.prevX = self.xPosition;
            self.prevY = self.yPosition;
            
            if(self.chase == "X"){
                self.chaseH(self.chaseX, self.chaseY, self.prevX, self.prevY);
            }
            else if(self.chase == "Y"){
                self.chaseV(self.chaseX, self.chaseY, self.prevX, self.prevY);
            }            
        }
    }
    
    this.move=function(dogPlayer) {
        
        if ((((self.xPosition == (dogPlayer.xPosition + 1))||(self.xPosition == (dogPlayer.xPosition - 1))) && (self.yPosition == dogPlayer.yPosition)) || 
        (((self.yPosition == (dogPlayer.yPosition + 1))||(self.yPosition == (dogPlayer.yPosition - 1))) && (self.xPosition == dogPlayer.xPosition))){
            self.bark(); 
        } 
        
        else if(dogPlayer.xPosition >= self.minX && dogPlayer.xPosition <= self.maxX
        && dogPlayer.yPosition >= self.minY && dogPlayer.yPosition <= self.maxY){
            self.chasePlayer(dogPlayer);
        }
        
        else if(self.ownedLandmarks[0].owner == self.dogID && 
        self.ownedLandmarks[1].owner == self.dogID &&
        self.ownedLandmarks[2].owner == self.dogID &&
        self.ownedLandmarks[3].owner == self.dogID){
            self.randomMovement();
        }
        
        else{
            console.log("you peed");
            for(var i = 0; i < self.ownedLandmarks.length; i++){
                if (self.ownedLandmarks[i].owner != self.dogID){
                    self.reclaimLandmark(ownedLandmarks[i]);
                    break;
                }
            }
        }

    };

    this.bark=function() {
    
    };

    this.barkedAt=function() {
        self.moveH(-1);
        self.moveV(-1);
    };
    
    this.pee=function() {
        var x;
        for(x=0; x<self.ownedLandmarks.length; x++) {
            //if player is next to landmark
             if ((((self.xPosition == (self.landmarks[x].xPosition + 1))||(self.xPosition == (self.landmarks[x].xPosition - 1))) && (self.yPosition == self.landmarks[x].yPosition)) || 
               (((self.yPosition == (self.landmarks[x].yPosition + 1))||(self.yPosition == (self.landmarks[x].yPosition - 1))) && (self.xPosition == self.landmarks[x].xPosition))) {
                 //if the landmark is not claimed, claim it
                 if ((self.landmarks[x].owner) != self.dogID) {
                     self.landmarks[x].owner == self.dogID;
                    // self.landmarks[x].show();
                 }
             }
        }
    };

    this.initialize();

};

/*
    Landmarks: owned by dog, ownership can be taken by peeing on it, has a location,
    ownership may be taken back to the original owner from the player
    has a type if we want a variety (hydrant, squeaky toy, shrubs, etc)
*/
var landmark = function(lID, dogID, xPos, yPos, type) {
    var self=this;
    this.yPosition=yPos;
    this.xPosition=xPos;
    this.originalowner=dogID;
    this.owner=dogID;
    this.type=type;
    this.landmarkID = lID;
    
    this.options={

    }

    this.initialize=function(){
        self.owner=self.originalowner;
    };

    this.initialize();
};

/*
    Kennels: owned by dog, ownership can not be taken, has a location
    may want to have a few colors for different dogs...
    maybe pick your dog's kennel color or something
*/
var kennel = function(dogID, xPos, yPos) {
    var self=this;
    this.yPosition=yPos;
    this.xPosition=xPos;
    this.owner = dogID;
    this.options={

    }

    this.initialize=function(){

    };

    this.initialize();
};