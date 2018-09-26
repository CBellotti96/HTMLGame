var doggyworldUI=function()
{
    var self=this;
    //this.game=undefined;
    this.running=false;
    this.initialize=function()
	this.playerInput = undefined;
    {
       // self.game=new doggyworldGame();
        $('#GameStopped').show();
        $('#GameRunning').hide();
        $('#playBoard').hide();
        $('#GameReset').show();
        
		//keydown
        $(document).on('keydown', function(event){
            //https://css-tricks.com/snippets/javascript/javascript-keycodes/
            if (event.which==97)//left - a
            {
                document.getElementById("DogPlayer").innerHTML = "LEFT"
				self.playerInput = 'a';
				/*
                self.game.player.moveH(-1);
                self.game.moveOnBoard(self.game.player);
                console.log(self.game.player.xPosition);
                console.log(self.game.player.yPosition);
                console.log(self.game.board);
                self.refreshView(); //might be better to call from doggyworld.js
				*/
            }
            else if (event.which==119) //up - w
            {
                document.getElementById("DogPlayer").innerHTML = "UP"
				self.playerInput = 'w';
				/*
                //self.game.player.moveV(-1);
                //self.game.moveOnBoard(self.game.player);
                console.log(self.game.player.xPosition);
                console.log(self.game.player.yPosition);
                console.log(self.game.board);
                self.refreshView();
				*/
            }
            else if (event.which==100) //right - d
            {
                document.getElementById("DogPlayer").innerHTML = "RIGHT"
				self.playerInput = 'd';
				/*
                //self.game.player.moveH(1);
                //self.game.moveOnBoard(self.game.player);
                console.log(self.game.player.xPosition);
                console.log(self.game.player.yPosition);
                console.log(self.game.board);
                self.refreshView();
				*/
            }
            else if (event.which==115) //down - s
            {
                document.getElementById("DogPlayer").innerHTML = "DOWN"
				self.playerInput = 's';
				/*
                //self.game.player.moveV(1);
                //self.game.moveOnBoard(self.game.player);
                document.getElementById("DogPlayer").innerHTML += ""+self.game.player.yPosition+""
                console.log(self.game.player.xPosition);
                console.log(self.game.player.yPosition);                
                console.log(self.game.board);
                self.refreshView();
				*/
            }
            else if (event.which==101) //e
            {
				self.playerInput = 'e';
                //pee
                //check if it hit landmark
                //if not already hit, mark as peed on
            }
        });
		
		//keyup
		$(document).on('keyup', function(event){
            //https://css-tricks.com/snippets/javascript/javascript-keycodes/
            if (event.which==97)//left - a
            {
				if(self.playerInput === 'a'){
					self.playerInput = undefined;
				}
            }
            else if (event.which==119) //up - w
            {
                if(self.playerInput === 'w'){
					self.playerInput = undefined;
				}
            }
            else if (event.which==100) //right - d
            {
                if(self.playerInput === 'd'){
					self.playerInput = undefined;
				}
            }
            else if (event.which==115) //down - s
            {
                if(self.playerInput === 's'){
					self.playerInput = undefined;
				}
            }
            else if (event.which==101) //e
            {
				if(self.playerInput === 'e'){
					self.playerInput = undefined;
				}
            }
        });
        
        
        $('#StartBtn').on('click',function(){
            self.game.startGameButton();
            $('#GameStopped').hide();
            $('#GameRunning').show();
            $('#playBoard').show()
            $('#Status').text('Go!');
            self.running=true;
            self.refreshView();
        });

        $('#PauseBtn').on('click',function(){
            self.game.stopGameButton();
            $('#GameStopped').show();
            $('#GameRunning').hide();
            $('#playBoard').show();
            $('#Status').text('Game paused...');
            self.running=false;
            self.refreshView();
        });
        
        $('#ResetBtn').on('click',function(){
            self.game.quitGameButton();
            $('#GameStopped').show();
            $('#GameRunning').hide();
            $('#playBoard').hide();
            $('#Status').text('Click to start!');
            self.running=false;
            self.game.reset();
            self.refreshView();
        });
    };
    /*
    this.refreshView=function(board, plain, player, dogs, kennels){
        $(document).ready(function(){
            $.each(self.game.board, function(index, value){
                $.each(value, function(index2, value2){
                    if (value2 != self.game.plain) {
                        if (value2 == self.game.player) {
                            $('#DogPlayer').css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        } else if (self.game.dogs.includes(value2)) {
                            $('#DogAI' + value2.dogID.toString()).css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        } else if (self.game.kennels.includes(value2)) {
                            $('#Kennel' + value2.owner.toString()).css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        } else { //landmark
                            $('#Landmark' + value2.landmarkID.toString()).css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        }
                    } 
                });
            });
        });
    };*/
	this.refreshView=function(board, plain, player, dogs, kennels){
        $(document).ready(function(){
            $.each(board, function(index, value){
                $.each(value, function(index2, value2){
                    if (value2 != plain) {
                        if (value2 == player) {
                            $('#DogPlayer').css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        } else if (dogs.includes(value2)) {
                            $('#DogAI' + value2.dogID.toString()).css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        } else if (kennels.includes(value2)) {
                            $('#Kennel' + value2.owner.toString()).css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        } else { //landmark
                            $('#Landmark' + value2.landmarkID.toString()).css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
                        }
                    } 
                });
            });
        });
    };
    /*
    this.takeShot=function()
    {
            //wait some amount of time
            var delay=Math.floor(Math.random()*1000+1001);
            //calculate shot
            self.game.calculateShot();
            setTimeout(function(){
                $('#Status').text('Get Ready...');
                self.refreshView();
                setTimeout(function(){ 
                    self.updateUI();},3000);        
            },delay);
        
    };*/
    /*
    this.updateUI=function()
    {
        if (self.running==false)
        {
            return;
        }
            var result=self.game.update(.1);
            self.refreshView();

            if (result==0){
                setTimeout(function(){self.updateUI();},10);
                return;
            }
            else if (result==1)
            {
                $('#Status').text('GOOOOOOAAAAAALLLLLL!!!!!')
            }
            else if (result==2)
            {   
                $('#Status').text('Great Block');
            }
            else
            {
                $('#Status').text('Miss')        ;
            }
            if (self.running==true)
            {
                self.takeShot();
            }

    }*/
    this.initialize();
}