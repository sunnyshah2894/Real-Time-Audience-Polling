var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var mongoose = require('mongoose');

var bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// var Author = require('./author');
// var Book = require('./book');
var Admin = require('./MongoSchema/admin.js');
var Room = require('./MongoSchema/room.js');
var Question = require('./MongoSchema/question.js');

var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/audience-poll', function (err) {
    if (err) throw err;

    console.log('Successfully connected');

    var admin1 = new Admin({
      _id: new mongoose.Types.ObjectId(),
      user:{
        firstName: 'Sunny',
        lastName: 'Shah'
      },
      userId: 'shahsun'
    })

    admin1.save(function(err){
      if(err) throw err;

      var room1 = new Room({
        _id: new mongoose.Types.ObjectId(),
        adminRoomName: 'room1-admin',
        clientRoomName: 'room1',
        admin: admin1._id
      });

      var room2 = new Room({
        _id: new mongoose.Types.ObjectId(),
        adminRoomName: 'room2-admin',
        clientRoomName: 'room2',
        admin: admin1._id
      });

      room1.save(function(err){
          if(err) throw err;
          var Q1 = new Question({
            _id: new mongoose.Types.ObjectId(),
            room: room1._id,
            type: 1,
            questionString: "Who is the Prime Minister Of India?",
            options:[
              {
                optionIndex: 1,
                optionValue: "ManMohan Singh"
              },
              {
                optionIndex: 2,
                optionValue: "Narendra Modi"
              },
              {
                optionIndex: 3,
                optionValue: "Raghuram Rajan"
              },
              {
                optionIndex: 4,
                optionValue: "Sunny Shah"
              }
            ],
            answerIndex: 4,
            answerString: "Sunny Shah"
          });
          var Q2 = new Question({
            _id: new mongoose.Types.ObjectId(),
            type: 1,
            room: room1._id,
            questionString: "Who is the Prime Minister Of India? 2",
            options:[
              {
                optionIndex: 1,
                optionValue: "ManMohan Singh2"
              },
              {
                optionIndex: 2,
                optionValue: "Narendra Modi2"
              },
              {
                optionIndex: 3,
                optionValue: "Raghuram Rajan3"
              },
              {
                optionIndex: 4,
                optionValue: "Sunny Shah4"
              }
            ],
            answerIndex: 3,
            answerString: "Raghuram Rajan3"
          });

          Q1.save(function(err) {
              if (err) throw err;

              console.log('Question 1 successfully saved.');
          });
          Q2.save(function(err) {
              if (err) throw err;

              console.log('Question 2 successfully saved.');
          });
          console.log("room1 saved successfully");
      });

      room2.save(function(err){
          if(err) throw err;
          var Q1 = new Question({
            _id: new mongoose.Types.ObjectId(),
            type: 1,
            room: room2._id,
            questionString: "Who is the President Of India?",
            options:[
              {
                optionIndex: 1,
                optionValue: "AKAD"
              },
              {
                optionIndex: 2,
                optionValue: "BOMBY"
              },
              {
                optionIndex: 3,
                optionValue: "GANDA"
              },
              {
                optionIndex: 4,
                optionValue: "GO"
              }
            ],
            answerIndex: 1,
            answerString: "AKAD"
          });
          var Q2 = new Question({
            _id: new mongoose.Types.ObjectId(),
            type: 1,
            room: room2._id,
            questionString: "Who is the President Of India? 2",
            options:[
              {
                optionIndex: 1,
                optionValue: "AKAD2"
              },
              {
                optionIndex: 2,
                optionValue: "BANBY2"
              },
              {
                optionIndex: 3,
                optionValue: "sdfsf3"
              },
              {
                optionIndex: 4,
                optionValue: "wewccs4"
              }
            ],
            answerIndex: 2,
            answerString: "BANBY2"
          });

          Q1.save(function(err) {
              if (err) throw err;

              console.log('Question 1 successfully saved.');
          });
          Q2.save(function(err) {
              if (err) throw err;

              console.log('Question 2 successfully saved.');
          });
          console.log("room2 saved Successfully");
      });


   });


});
