var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    userId: String
});

var AdminSchema = mongoose.model('Admin', adminSchema);

module.exports = AdminSchema;
