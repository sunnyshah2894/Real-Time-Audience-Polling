$(document).ready(function () {

    var socket = io.connect();
    var currRoomJoined ;

    socket.on('customRetry', function() {
      customConnect();
    });

    function customConnect(localStorageAvailable){
      var username = null;
      console.log("checking usernae");
      if (localStorageAvailable) {

          if (localStorage.getItem("username") === null) {
              $('#myUsernameChooserModal').modal();
          }
          else{
              username = localStorage.getItem("username");
              socket.emit('setUsername', username);
          }
      } else {
          //username = prompt('What\'s your username?');
          $('#myUsernameChooserModal').modal();
      }
      if( currRoomJoined ){
          $('#joinRoom').click();
      }
      else {
          $('#myRoomChooserModal').modal();
      }
    }
    var localStorageAvailable = false;
    if (typeof(Storage) !== "undefined") {
      localStorageAvailable = true;
    }
    customConnect(localStorageAvailable);

    var questionsAnswered = [];
    if(localStorageAvailable){
        if(localStorage.getItem("questionsAnswered") === null ){ //havent answered any questions
            questionsAnswered = [];
            localStorage.setItem("questionsAnswered" , JSON.stringify(questionsAnswered));
        }
        else{
          questionsAnswered = JSON.parse(localStorage.getItem("questionsAnswered"));
        }
    }

    // The visitor is asked for their username...

    //var roomName = prompt("whats the room you are joining") ;

    $('#joinRoom').click(function(e){
      var roomName = $('#roomName').val();
      currRoomJoined = roomName;
      console.log("join room " + roomName);
      socket.emit('clientJoinRoom',roomName);
      $('#myRoomChooserModal').modal('hide');
    });

    $('#submitUserID').click(function(e){

      var userID = $('#userID').val();
      localStorage.setItem("username", userID);
      socket.emit('setUsername', userID);
      $('#myUsernameChooserModal').modal('hide');
    });




    socket.on('refresh',function(message){
      location.reload();
    });

    socket.on('messageSessionNotStarted' , function(message){
      showSnakbar(message);
    });
    socket.on('messageSessionEnd' , function(message){
      showSnakbar(message);
    });
    socket.on('disconnect' , function(message){
      var x = document.getElementById("snackbar");
      $('#snackbar').html("You are disconnected! Please refresh to join again.");
      x.className = "show";
      socket.disconnect();
    });
    // A dialog box is displayed when the server sends us a "message"
    socket.on('questionAvailable', function(message) {

        if( !questionsAnswered.includes(message._id) ){

          $(".bg_load").fadeOut("slow");
          $(".wrapper").fadeOut("slow");

          console.log(message);
          $('#questionString').text(message.questionString);
          $('#option1').text(message.options[0].optionValue || "Option not Avalaible");

          $('#option2').text(message.options[1].optionValue || "Option not Avalaible");

          $('#option3').text(message.options[2].optionValue || "Option not Avalaible");

          $('#option4').text(message.options[3].optionValue || "Option not Avalaible");

          $('#questionId').val(message._id);
        }

    });

    function showSnakbar(messageToShow) {
        var x = document.getElementById("snackbar");
        $('#snackbar').html(messageToShow);
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    $('[id^=option]').click(function(e){
      e.preventDefault();
      var selected = $(this).text();
      var optionName = this.id;
      var answerSelectIndex = parseInt(optionName[optionName.length -1]);
      var answerObj={
        questionID: $('#questionId').val(),
        answer: selected,
        answerIndex: answerSelectIndex
      };
      questionsAnswered.push(answerObj.questionID);
      if(localStorageAvailable){
        localStorage.setItem("questionsAnswered" , JSON.stringify(questionsAnswered));
        console.log( questionsAnswered );
      }
      socket.emit("answer",answerObj);
      showSnakbar("Thanks for answering!");
      //setTimeout(function(){location.reload();},3000);
      $(".bg_load").fadeIn("slow");
      $(".wrapper").fadeIn("slow");

    });

    // When the button is clicked, a "message" is sent to the server
    // $('#poke').click(function () {
    //     socket.emit('message', 'Hi server, how are you?');
    // })

});
