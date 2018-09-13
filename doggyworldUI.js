var doggyworldUI=function()
{
    var self=this;
    this.game=undefined;
    this.running=false;
    this.initialize=function()
    {
        self.game=new doggyworldGame();
     
        $('#GameStopped').show();
        $('#GameRunning').hide();
     
      $('body').keypress(function(event){
            if (event.which==37)//left
            {
                //self.game.player.moveH(-1);
            }
            else if (event.which=38) //up
            {
                //self.game.player.moveV(-1);
            }
            else if (event.which=39) //right
            {
                //self.game.player.moveH(1);
            }
            else if (event.which=40) //down
            {
                //self.game.player.moveV(1);
            }
            else if (event.which=69) //e
            {
                //pee
                //check if it hit landmark
                //if not already hit, mark as peed on
            }
            $('#player').css("top",self.game.player.Position+'px');
        });
        
        
        $('#StartBtn').on('click',function(){
            $('#GameStopped').hide();
            $('#GameRunning').show();
            $('#Status').text('Get Ready...');
            self.running=true;
            self.refreshView();
            //self.takeShot();
        });
        $('#StopBtn').on('click',function(){
            $('#GameStopped').show();
            $('#GameRunning').hide();
            self.running=false;
            self.game.reset();
            self.refreshView();
        });
    };
    this.refreshView=function(){
        //$('#playBoard').text(self.game.board);
        $(document).ready(function(){
            $.each(self.game.board, function(index, value){
                $.each(value, function(index2, value2){
                    if (value2 != self.game.plain) {
                        if (value2 == self.game.player) {
                            $('#playBoard').append(index2 + ": " + "player ");
                        } else if (value2 == self.game.dogAI1 || value2 == self.game.dogAI2 || value2 == self.game.dogAI3) {
                            $('#playBoard').append(index2 + ": " + "aidog ");
                        } else if (value2 == self.game.dogAI1.kennel || value2 == self.game.dogAI2.kennel || value2 == self.game.dogAI3.kennel) {
                            $('#playBoard').append(index2 + ": " + "kennel ");
                        } else {
                            $('#playBoard').append(index2 + ": " + "landmark ");
                        }
                    } else {
                        $('#playBoard').append(index2 + ": " + value2 + " ");
                    }
                });
                $('#playBoard').append('<br>');
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