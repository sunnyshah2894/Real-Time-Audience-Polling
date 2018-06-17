var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var fs = require('fs');
var mongoose = require('mongoose');

var bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('node_modules'));
app.use(express.static('css'));
app.use(express.static('js'));

// var Author = require('./author');
// var Book = require('./book');
var Admin = require('./MongoSchema/admin.js');
var Room = require('./MongoSchema/room.js');
var Question = require('./MongoSchema/question.js');

//var port = process.env.PORT || 8080;

var config = {
  "mongo": {
    "hostString": "6b.mongo.evennode.com:27017/7897460a5f0642c1b419d869e9b73219",
    "user": "7897460a5f0642c1b419d869e9b73219",
    "db": "7897460a5f0642c1b419d869e9b73219"
  }
};
var mongoPassword = 'sunnyshah28';
mongoose.connect("mongodb://" + config.mongo.user + ":" + encodeURIComponent(mongoPassword) + "@" +
    config.mongo.hostString, function (err) {
    if (err) throw err;

    console.log('Successfully connected');

    Room.find({}).exec(function(err,data){



    });

    //
    // var admin1 = new Admin({
    //   _id: new mongoose.Types.ObjectId(),
    //   user:{
    //     firstName: 'Sunny',
    //     lastName: 'Shah'
    //   },
    //   userId: 'shahsun'
    // })
    //
    // admin1.save(function(err){
    //   if(err) throw err;
    //
    //   var room1 = new Room({
    //     _id: new mongoose.Types.ObjectId(),
    //     adminRoomName: 'room1-admin',
    //     clientRoomName: 'room1',
    //     admin: admin1._id
    //   });
    //
    //   var room2 = new Room({
    //     _id: new mongoose.Types.ObjectId(),
    //     adminRoomName: 'room2-admin',
    //     clientRoomName: 'room2',
    //     admin: admin1._id
    //   });
    //
    //   room1.save(function(err){
    //       if(err) throw err;
    //       var Q1 = new Question({
    //         _id: new mongoose.Types.ObjectId(),
    //         type: 1,
    //         room: room1._id,
    //         questionString: "Who is the Prime Minister Of India?",
    //         options:[
    //           {
    //             optionIndex: 1,
    //             optionValue: "ManMohan Singh"
    //           },
    //           {
    //             optionIndex: 2,
    //             optionValue: "Narendra Modi"
    //           },
    //           {
    //             optionIndex: 3,
    //             optionValue: "Raghuram Rajan"
    //           },
    //           {
    //             optionIndex: 4,
    //             optionValue: "Sunny Shah"
    //           }
    //         ],
    //         answerIndex: 4,
    //         answerString: "Sunny Shah"
    //       });
    //       var Q2 = new Question({
    //         _id: new mongoose.Types.ObjectId(),
    //         type: 1,
    //         room: room1._id,
    //         questionString: "Who is the Prime Minister Of India? 2",
    //         options:[
    //           {
    //             optionIndex: 1,
    //             optionValue: "ManMohan Singh2"
    //           },
    //           {
    //             optionIndex: 2,
    //             optionValue: "Narendra Modi2"
    //           },
    //           {
    //             optionIndex: 3,
    //             optionValue: "Raghuram Rajan3"
    //           },
    //           {
    //             optionIndex: 4,
    //             optionValue: "Sunny Shah4"
    //           }
    //         ],
    //         answerIndex: 3,
    //         answerString: "Raghuram Rajan3"
    //       });
    //
    //       Q1.save(function(err) {
    //           if (err) throw err;
    //
    //           console.log('Question 1 successfully saved.');
    //       });
    //       Q2.save(function(err) {
    //           if (err) throw err;
    //
    //           console.log('Question 2 successfully saved.');
    //       });
    //       console.log("room1 saved successfully");
    //   });
    //
    //   room2.save(function(err){
    //       if(err) throw err;
    //       var Q1 = new Question({
    //         _id: new mongoose.Types.ObjectId(),
    //         type: 1,
    //         room: room2._id,
    //         questionString: "Who is the President Of India?",
    //         options:[
    //           {
    //             optionIndex: 1,
    //             optionValue: "AKAD"
    //           },
    //           {
    //             optionIndex: 2,
    //             optionValue: "BOMBY"
    //           },
    //           {
    //             optionIndex: 3,
    //             optionValue: "GANDA"
    //           },
    //           {
    //             optionIndex: 4,
    //             optionValue: "GO"
    //           }
    //         ],
    //         answerIndex: 1,
    //         answerString: "AKAD"
    //       });
    //       var Q2 = new Question({
    //         _id: new mongoose.Types.ObjectId(),
    //         type: 1,
    //         room: room2._id,
    //         questionString: "Who is the President Of India? 2",
    //         options:[
    //           {
    //             optionIndex: 1,
    //             optionValue: "AKAD2"
    //           },
    //           {
    //             optionIndex: 2,
    //             optionValue: "BANBY2"
    //           },
    //           {
    //             optionIndex: 3,
    //             optionValue: "sdfsf3"
    //           },
    //           {
    //             optionIndex: 4,
    //             optionValue: "wewccs4"
    //           }
    //         ],
    //         answerIndex: 2,
    //         answerString: "BANBY2"
    //       });
    //
    //       Q1.save(function(err) {
    //           if (err) throw err;
    //
    //           console.log('Question 1 successfully saved.');
    //       });
    //       Q2.save(function(err) {
    //           if (err) throw err;
    //
    //           console.log('Question 2 successfully saved.');
    //       });
    //       console.log("room2 saved Successfully");
    //   });


   });

});


// Loading socket.io
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index2.html');
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/admin.html');
});

app.post('/admin/addNewRoom', (req,res) => {

  var adminRoomName = req.body.adminRoomName;
  var clientRoomName = req.body.clientRoomName;
  var adminId = req.body.adminID;

  var newRoom = new Room({
    _id: new mongoose.Types.ObjectId(),
    clientRoomName: clientRoomName,
    adminRoomName: adminRoomName,
    admin: adminId
  });

  newRoom.save(function(err,data){
      /* if admin undefined handle the event */
        Room.find({admin: adminId}).select('adminRoomName _id').exec(function(err,rooms){
          console.log(rooms);
          socket.emit("getRooms",rooms);

        });
  });

});

app.post('/admin/publishQuestion', (req, res) => {
  console.log(req.body);

  Room.findById(req.body.room,function(err , clientRoomName){
    if(err) throw err;

    var newQuestion = new Question({
      _id: new mongoose.Types.ObjectId(),
      type: 1,
      questionString: req.body.questionString,
      options:[
        {
          optionIndex:1,
          optionValue: req.body.option1
        },
        {
          optionIndex:2,
          optionValue: req.body.option2
        },
        {
          optionIndex:3,
          optionValue: req.body.option3
        },
        {
          optionIndex:4,
          optionValue: req.body.option4
        }
      ],
      answerIndex: req.body.answer,
      answerString: req.body['option'+req.body.answer]
    });
    newQuestion.save(function(err,data) {
        if (err) throw err;

        console.log('New Question successfully saved.' + data);
        console.log("client room to publish - "+clientRoomName.clientRoomName);
        io.sockets.in(clientRoomName.clientRoomName).emit("questionAvailable",data);
    });

  });
})


io.sockets.on('connection', function (socket, username) {
    // When the client connects, they are sent a message
    //--socket.emit('message', 'You are connected!');
    // The other clients are told that someone new has arrived
    //--socket.broadcast.emit('message', 'Another client has just connected!');

    // As soon as the username is received, it's stored as a session variable

    socket.on("joinAsAdmin",function(userID){
      console.log("dekhta hu");
      Admin
      .findOne({userId:userID})
      .exec(function(err, admin){
        if(!admin) return;
        console.log("admin: "+ admin._id);
        socket.emit("adminId",admin._id);
        console.log(admin);
        if( admin ){
        /* if admin undefined handle the event */
            Room.find({admin: admin._id}).select('adminRoomName _id').exec(function(err,rooms){
              console.log(rooms);
              socket.emit("getRooms",rooms);

            });
          }
      });

    });

    socket.on('setUsername', function(username) {
        socket.username = username;
    });

    socket.on('publishQuestion' , function(data){
        console.log(data);
        console.log("sdfnsdn"+data.room);
    });

    socket.on('joinRoom' , function(roomDetails){
        console.log(roomDetails);
        console.log("roomID = "+roomDetails.roomID);
        socket.leave(socket.room);

        socket.join(roomDetails.roomName);
        socket.room = roomDetails.roomName;
        socket.roomID = roomDetails.roomID;
        Question.find({room: roomDetails.roomID}).exec(function(err, questions){
            console.log("questions in admin room: "+questions);
            socket.emit("questionsAlreadyInRoom",questions);
        });
        socket.emit('message','You are connected to '+roomDetails.roomName);

    });

    socket.on('clientJoinRoom' , function(roomName){
        console.log(roomName);

        Room.findOne({clientRoomName:roomName}).select('_id').exec(function(err,roomDetails){
          if(roomDetails){
            console.log("roomID = "+roomDetails._id + " roomname = " + roomName);
            socket.leave(socket.room);
            socket.join(roomName);
            socket.room = roomName;
            socket.roomID = roomDetails._id;
            socket.emit('message','You are connected to '+ roomName);
          }
          else{
            socket.emit('refresh', "The room is not Avalaible" );
          }

        });
    });
    var rooms = ['room1','room2'];

    socket.on('answer',function(answerObj){
      console.log(answerObj);
      Question.findById(answerObj.questionID,function(err,question){
          if( answerObj.answer === question.answerString ){
              Room.findById(socket.roomID,function(err,room){
                  var userDetails = {
                    username: socket.username,
                    time: new Date()
                  };
                  console.log(userDetails);
                  console.log(socket.username);
                  io.sockets.in(room.adminRoomName).emit('answerByUser',userDetails);
              });
          }
      });

    });

    // When a "message" is received (click on the button), it's logged in the console
    // socket.on('message', function (message) {
    //     // The username of the person who clicked is retrieved from the session variables
    //     console.log(socket.username + ' is speaking to me! They\'re saying: ' + message);
    // });
});
var port = process.env.PORT;

http.listen(port, function(){
  console.log('listening on * -- :' + port);
});
