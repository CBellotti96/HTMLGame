var doggyworldUI=function()
{
    var self=this;
    var markedLandmarks;
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

		
		$(document).on('keypress', function(event){
            //https://css-tricks.com/snippets/javascript/javascript-keycodes/			
				if (event.which==97)//left - a
				{
					self.playerInput = 'a';
				}
				else if (event.which==119) //up - w
				{
					self.playerInput = 'w';
				}
				else if (event.which==100) //right - d
				{
					self.playerInput = 'd';
				}
				else if (event.which==115) //down - s
				{
					self.playerInput = 's';
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
		
    }

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
			
		
		
	};
	
    this.initialize();

};