var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  author: {type: String, required: true},
  content:{type: String, required: true},
  votes:{type: Number, default:0, min:0}
});

var eventSchema = new mongoose.Schema({
    club: {type: String, required: true},
    title: {type: String, required: true},
    time:{type: Date, default: Date.now},
    comments:[commentSchema],
},{usePushEach:true});

mongoose.model('Event', eventSchema);
