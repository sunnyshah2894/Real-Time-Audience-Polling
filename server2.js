
//var cluster = require('cluster');
//var sticky = require('sticky-session');
//var net = require('net');
//var farmhash = require('farmhash');
//var redis = require( "redis" );
//var numCPUs = require('os').cpus().length - 1;


var port = process.env.PORT || 8080;
var randNum = Math.floor((Math.random() * 10) + 1);

// cachegoose(mongoose, {
//   engine: 'redis',    /* If you don't specify the redis engine,      */
//   port: 6379,         /* the query results will be cached in memory. */
//   host: 'localhost'
// });
  var app = require('express')();
  var express = require('express');
  var http = require('http').Server(app);
  var fs = require('fs');
  var mongoose = require('mongoose');
  var sio = require('socket.io');
  var configuration = require('./config');

  const Json2csvParser = require('json2csv').Parser;
  //var cachegoose = require('cachegoose');
  var mongooseCachebox = require('mongoose-cachebox');

  // Don't expose our internal server to the outside.
	//var server = app.listen(0, 'localhost'),
	var io = sio(http);

  var redis = require('socket.io-redis');
  //var redis = require('redis');
  io.adapter(redis(configuration.redis));
  // var redisURL = url.parse("redis-13394.c55.eu-central-1-1.ec2.cloud.redislabs.com:13394");
  // var client = redis.createClient(13394, "redis-13394.c55.eu-central-1-1.ec2.cloud.redislabs.com", {no_ready_check: true});
  // client.auth("EYjvK6X0Y777W5gcxLvGHO7CBwUmbFtj");

  var options = {
    cache: true, // start caching
    ttl: 30 // 30 seconds
  };

  // adding mongoose cachebox
  mongooseCachebox(mongoose, options);

  const fields = ['_id', 'userID', 'questionID._id','questionID.questionString','userAnswerIndex','userAnswerString','roomID','actualAnswerIndex','actualAnswerString'];
  const opts = { fields };
  const json2csvParser = new Json2csvParser({ fields });

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
  var UserAnswers =require('./MongoSchema/UserAnswers.js');




  var mongoConnection = "mongodb://" + configuration.mongoConnectionConfig.mongo.user + ":" + encodeURIComponent(configuration.mongoConnectionConfig.mongo.password) + "@" + configuration.mongoConnectionConfig.mongo.hostString ;

  //var mongoConnection = "mongodb://sunnyshah@audiencepoll:sunnyshah28@mongodb/audience-poll";
  //var mongoConnection = "mongodb://localhost/audience-poll";
  mongoose.connect(mongoConnection, function (err) {
      if (err) throw err;

      console.log('Successfully connected');

  });

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index2.html');
  });

  app.get('/admin', function(req, res){
    res.sendFile(__dirname + '/admin.html');
  });

  app.get('/getAnswers/:roomAdminName', function (req, res) {
    console.log(req.params.roomAdminName);
    Room.findOne({adminRoomName:req.params.roomAdminName}).select('_id').exec(function(err,roomDetails){
      if( roomDetails ){
        UserAnswers.find({roomID:roomDetails._id}).populate('questionID','questionString').exec(function(err,userDetails){
            res.send( userDetails );
        });
      }
      else{
          res.status(404).send("The admin room entered is invalid");
      }
    });
  })

  app.get('/getAnswersCSV/:roomAdminName' , function( req,res ){

    console.log( req.params.roomAdminName );
    Room.findOne({adminRoomName:req.params.roomAdminName}).select('_id').exec(function(err,roomDetails){
        if (err) throw err;
        if( roomDetails  ){
          UserAnswers.find({roomID:roomDetails._id}).populate('questionID','questionString').exec(function(err,userDetails){
            if (err) res.send(err);
              res.setHeader('Content-disposition', 'attachment; filename=userDetails.csv');
              res.set('Content-Type', 'text/csv');
              res.status(200).send(getCSVFromJson(userDetails));
          });
        }
        else{
            res.status(404).send("The admin room entered is invalid");
        }
    });

  });
  function getCSVFromJson(userDetails){

      return (json2csvParser.parse(userDetails));

  }

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
            console.log("New room added - " + adminRoomName);
            socket.emit("getRooms",rooms);

          });
    });

  });

  io.sockets.on('connection', function (socket) {

      console.log("connected with someone on - " + randNum);
      socket.on( "disconnect" , function(){
          console.log("disconnected");
      } );
      socket.on("reconnect",function(){
          console.log("reconnect fired");
          if( !socket.roomID )
            socket.emit("customRetry","");
      });
      socket.on("joinAsAdmin",function(userID){
        Admin
        .findOne({userId:userID})
        .exec(function(err, admin){
          if(!admin) return;
          socket.emit("adminId",admin._id);
          socket.adminID = admin._id;
          if( admin ){
            console.log("Admin joined - " + admin._id);
          /* if admin undefined handle the event */
              Room.find({admin: admin._id}).select('adminRoomName _id').exec(function(err,rooms){
                console.log("Sending available rooms to admin");
                socket.emit("getRooms",rooms);
              });
            }
        });

      });

      socket.on('setUsername', function(username) {
          console.log("Worker = " + randNum);
          socket.username = username;
      });

      socket.on('publishExistingQuestion' , function(data){
          console.log("Worker = " + randNum);
          if( !socket.roomID ){
              socket.emit('refresh', "Stale connection" );
              return;
          }
          delete data['answerString'];
          delete data['answerIndex'];
          //console.log("Question received is : " + JSON.stringify(data)) ;
          Room.findById(socket.roomID,function(err,roomData){

              roomData.currQuestion = data['_id'];
              roomData.save();

              console.log("Publishing question. Client room to publish - " + roomData.clientRoomName);
              io.sockets.in(roomData.clientRoomName).emit("questionAvailable",data);

          });

      });


      function updateRoom( roomId, questionId ){
          console.log("Worker = " + randNum);
          if( !socket.roomID ){
              socket.emit('refresh', "Stale connection" );
              return;
          }
          Room.findById(roomId , function(err, roomData){

              if(err) throw err;
              console.log("Question updated in the room");
              roomData.currQuestion = questionId;
              roomData.save();

          });
      }

      function createQuestionSchemaFromJSON( roomId, data ){

        var newQuestion = new Question({
          _id: new mongoose.Types.ObjectId(),
          room: roomId,
          type: 1,
          questionString: data.questionString,
          options:[
            {
              optionIndex:1,
              optionValue: data.option1
            },
            {
              optionIndex:2,
              optionValue: data.option2
            },
            {
              optionIndex:3,
              optionValue: data.option3
            },
            {
              optionIndex:4,
              optionValue: data.option4
            }
          ],
          answerIndex: data.answer,
          answerString: data['option'+data.answer]
        });
        return newQuestion;
      }

      socket.on('adminAddNewQuestion' , function(question){
          console.log("Worker = " + randNum);
          if( !socket.roomID ){
              socket.emit('refresh', "Stale connection" );
              return;
          }
          var newQuestion = createQuestionSchemaFromJSON( socket.roomID , question );
          newQuestion.save(function(err,data) {
              if( err ) throw err;
              console.log( "New question saved successfully" );
              Question.find({room: socket.roomID}).exec(function(err, questions){
                  console.log("Publishing new question list back to admin");
                  socket.emit("questionsAlreadyInRoom",questions);
              });
          });;

      });
      socket.on( 'adminAddRoom' , function(roomDetails){
        console.log("Worker = " + randNum);
        if( !socket.roomID ){
            socket.emit('refresh', "Stale connection" );
            return;
        }
        var newRoom = new Room({
          _id: new mongoose.Types.ObjectId(),
          adminRoomName: roomDetails.roomPrivateKey,
          clientRoomName: roomDetails.roomPublicKey,
          isFinished: false,
          hasStarted: false,
          currQuestion: null,
          admin: socket.adminID
        });
        Room.find( { $or:[ {'clientRoomName':roomDetails.roomPublicKey}, {'adminRoomName':roomDetails.roomPrivateKey} ]},
          function(err,record){
            if(!err)
            if( record.length ){
              socket.emit( "invalidRoomAddition" , "Room already exists! Please use a different public/private key" );
            }
            else{
              newRoom.save( function(err,data){
                  console.log("New room have been added");
                  var roomData = {
                    adminRoomName: data.adminRoomName,
                    _id: data._id
                  };
                  socket.emit( "newRoomAdded" , roomData );
              });
            }
        });

      });

      socket.on( 'startRoom' , function(roomID){
        console.log("Worker = " + randNum);
        if( !socket.roomID ){
            socket.emit('refresh', "Stale connection" );
            return;
        }
        console.log("Starting room : " + roomID );
        Room.findById(roomID , function(err, roomData){

            if(err) throw err;
            roomData.hasStarted = true;
            roomData.isFinished = false;
            roomData.question = null;
            roomData.save();
            socket.emit('message' , "Room "+ roomData.adminRoomName + " has now successfully started!" );

        });

      });
      socket.on( 'closeRoom' , function(roomID){
        console.log("Worker = " + randNum);
        if( !socket.roomID ){
            socket.emit('refresh', "Stale connection" );
            return;
        }
        console.log("Closing room : " + roomID );
        Room.findById(roomID , function(err, roomData){

            if(err) throw err;
            roomData.isFinished = true;
            roomData.question = null;
            roomData.save();
            socket.emit('message' , "Room "+ roomData.adminRoomName + " has been closed!" );

        });

      });

      socket.on('publishNewQuestion' , function(data){
          console.log("Worker = " + randNum);
          if( !socket.roomID ){
              socket.emit('refresh', "Stale connection" );
              return;
          }
          var newQuestion = createQuestionSchemaFromJSON( socket.roomID , data );
          newQuestion.save(function(err,data) {
              if (err) throw err;
              var dataObj = data.toObject();
              delete dataObj['answerString'];
              delete dataObj['answerIndex'];
              console.log('New Question successfully saved!');

              Room.findById(socket.roomID,function(err,roomData){
                  roomData.currQuestion = dataObj['_id'];
                  roomData.save();

                  console.log("Publishing the new question. Client room to publish - "+roomData.clientRoomName);
                  io.sockets.in(roomData.clientRoomName).emit("questionAvailable",dataObj);

              });


          });

      });

      socket.on('serverJoinRoom' , function(roomDetails){
          console.log("Worker = " + randNum);
          console.log("Admin joined roomID = "+roomDetails.roomID);
          socket.leave(socket.room);
          socket.join(roomDetails.roomName);
          socket.room = roomDetails.roomName;
          socket.roomID = roomDetails.roomID;
          Question.find({room: roomDetails.roomID}).exec(function(err, questions){
              console.log("Publishing the existing questions in the room to admin");
              socket.emit("questionsAlreadyInRoom",questions);
          });
          socket.emit('message','You are connected to '+roomDetails.roomName);

      });

      socket.on('clientJoinRoom' , function(roomName){
          console.log("Worker = " + randNum);
          Room.findOne({clientRoomName:roomName}).select('_id isFinished hasStarted currQuestion').exec(function(err,roomDetails){
            if(roomDetails){
              console.log("Client joined roomID = "+roomDetails._id + " roomname = " + roomName);
              socket.leave(socket.room);
              socket.join(roomName);
              socket.room = roomName;
              socket.roomID = roomDetails._id;
              socket.emit('message','You are connected to '+ roomName);
              if( !roomDetails.hasStarted ){
                socket.emit("messageSessionNotStarted" , "The room's session has not yet started.");
              }
              if( roomDetails.isFinished ){
                socket.emit("messageSessionEnd" , "The room's session is complete.");
              }
              else{
                Question.findById(roomDetails.currQuestion , function(err,question){
                  if( question ){
                    socket.emit("questionAvailable",question);
                  }
                });
              }

            }
            else{
              socket.emit('refresh', "The room is not Avalaible" );
            }

          });


      });
      var rooms = ['room1','room2'];

      socket.on('answer',function(answerObj){
        console.log("Worker = " + randNum);
        if( !socket.roomID ){
            socket.emit('refresh', "Stale connection" );
            return;
        }
        Question.findById(answerObj.questionID,function(err,question){
            Room.findById(socket.roomID,function(err,room){
                var userDetails = {
                  username: socket.username,
                  time: new Date()
                };
                if( answerObj.answer === question.answerString ){
                  io.sockets.in(room.adminRoomName).emit('answerByUser',userDetails);
                }
                var UserAnswer = new UserAnswers({
                    _id: new mongoose.Types.ObjectId(),
                    userID: socket.username,
                    questionID: answerObj.questionID,
                    userAnswerIndex: answerObj.answerIndex,
                    userAnswerString: answerObj.answer,
                    roomID: socket.roomID,
                    actualAnswerIndex: question.answerIndex,
                    actualAnswerString: question.answerString,
                    time: new Date()
                });
                UserAnswer.save(function(err,data){
                    if(err) throw err;
                    console.log("User response saved!");
                });
            });


        });

      });

      // When a "message" is received (click on the button), it's logged in the console
      // socket.on('message', function (message) {
      //     // The username of the person who clicked is retrieved from the session variables
      //     console.log(socket.username + ' is speaking to me! They\'re saying: ' + message);
      // });
  });

  http.listen(port, function(){
    console.log(randNum + ' no. thread is listening on * -- :' + port);
  });

//}
