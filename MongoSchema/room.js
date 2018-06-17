var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    adminRoomName: String,
    clientRoomName: String,
    created: {
        type: Date,
        default: Date.now
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    isFinished: Boolean,
    currQuestion: mongoose.Schema.Types.ObjectId

});

var RoomSchema = mongoose.model('Room', roomSchema);

module.exports = RoomSchema;
