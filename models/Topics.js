var mongoose = require('mongoose');

var TopicSchema = new mongoose.Schema({
  id : String,
  title: String,
  description: String,
  dates: [String],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
});

mongoose.model('Topic', TopicSchema);
