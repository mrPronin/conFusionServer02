// grab the things we need
var mongoose = require('mongoose');

// Use native promises
// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// create a schema
var leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Leaders = mongoose.model('Leader', leaderSchema);

// make this available to our Node applications
module.exports = Leaders;