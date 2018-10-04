var doggyworldUI=function()
{
    var self=this;
    var markedLandmarks;
    //this.game=undefined;
    this.running=false;
    this.initialize=function(){
		$('#GameStopped').show();
        $('#GameRunning').hide();
        $('#playBoard').hide();
        $('#GameReset').show();
        $('#WinScreen').hide();

	};
	this.playerInput = undefined;
	this.notInitialized = 0;
	
	
	
    {
		/*
       // self.game=new doggyworldGame();
        $('#GameStopped').show();
        $('#GameRunning').hide();
        $('#playBoard').hide();
        $('#GameReset').show();
        */
		
		$(document).on('keypress', function(event){
            //https://css-tricks.com/snippets/javascript/javascript-keycodes/			
				if (event.which==97)//left - a
				{
					//$('#DogPlayer').css("background-image", "url('images/blueDog/left/leftIdle.png')");
					self.playerInput = 'a';
					/*
					console.log(self.game.player.xPosition);
					console.log(self.game.player.yPosition);                
					console.log(self.game.board);*/
				}
				else if (event.which==119) //up - w
				{
					//$('#DogPlayer').css("background-image", "url('images/blueDog/up/upIdle.png')");
					self.playerInput = 'w';
					/*
					console.log(self.game.player.xPosition);
					console.log(self.game.player.yPosition);                
					console.log(self.game.board);*/
				}
				else if (event.which==100) //right - d
				{
					//$('#DogPlayer').css("background-image", "url('images/blueDog/right/rightIdle.png')");
					self.playerInput = 'd';
					/*
					console.log(self.game.player.xPosition);
					console.log(self.game.player.yPosition);                
					console.log(self.game.board);*/
				}
				else if (event.which==115) //down - s
				{
					//$('#DogPlayer').css("background-image", "url('images/blueDog/down/downIdle.png')");
					self.playerInput = 's';
					/*
					console.log(self.game.player.xPosition);
					console.log(self.game.player.yPosition);                
					console.log(self.game.board);*/
				}
				else if (event.which==101) //e
				{
					self.playerInput = 'e';
					//pee
					//check if it hit landmark
					//if not already hit, mark as peed on
				}
				else if (event.which==113) //q
				{
					self.playerInput = 'q';
					//bark
				}

        });
        
        /*
        $('#StartBtn').on('click',function(){
            //self.game.startGameButton();
            $('#GameStopped').hide();
            $('#GameRunning').show();
            $('#playBoard').show()
            $('#Status').text('Go!');
            self.running=true;
            self.refreshView();
        });

        $('#PauseBtn').on('click',function(){
            //self.game.stopGameButton();
            $('#GameStopped').show();
            $('#GameRunning').hide();
            $('#playBoard').show();
            $('#Status').text('Game paused...');
            self.running=false;
            self.refreshView();
        });
        
        $('#ResetBtn').on('click',function(){
            //self.game.quitGameButton();
            $('#GameStopped').show();
            $('#GameRunning').hide();
            $('#playBoard').hide();
            $('#Status').text('Click to start!');
            self.running=false;
            self.game.reset();
            self.refreshView();
        });
		*/
		
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
	this.refreshView=function(board, plain, player, dogs, kennels, init){
        $(document).ready(function(){
            $.each(board, function(index, value){
                $.each(value, function(index2, value2){
                    if (value2 != plain) {
                        if (value2 == player) {
							/*if(init){
								$('#DogPlayer').css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
							}*/
							//$('#DogPlayer').animate({left: ''+(68*player.PositionX)+'px', top: ''+(50*player.PositionY)+'px'}, 500)
                        } else if (dogs.includes(value2)) {
							/*if(init){
								$('#DogAI' + value2.dogID.toString()).css("grid-area", (index + 1).toString() + "/" + (index2 + 1).toString());
							}*/
							//$('#DogAI' + value2.dogID.toString()).animate({left: ''+(68*value2.PositionX)+'px', top: ''+(50*value2.PositionY)+'px'}, 500)
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
	
	this.animate=function(htmlID, PositionX, PositionY, input){
		
		//htmlID (string) the ID of the parent object you want to move in the html file ex. "DogPlayer"
		//positionX (int) the destination of the animation?
		//positionY (int) the destination of the animation
		//input (string) ("left","right","up","down")
		var dogType = undefined;
		
		if(htmlID == "DogPlayer"){
			dogType = "blueDog";
		}else{
			dogType = "redDog";
		}
		
		$("#" + htmlID).css("background-image", "url('images/"+dogType+"/"+input+"/"+input+"Gif.gif')");
		
		$("#" + htmlID).animate({left: ''+(68*PositionX)+'px', top: ''+(50*PositionY)+'px'}, 350);
		
		setTimeout(function() {
			$("#" + htmlID).css("background-image", "url('images/"+dogType+"/"+input+"/"+input+"Idle.png')");
		}, 350);
			
		
		
	}
    
	/*
    this.tick=function(){
        setInterval(function () { 
            //if running? TODO
                self.refreshView();
            //end if
        }, 1000); 
    }*/
	
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
    //this.tick();
}