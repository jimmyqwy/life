var mongoose = require('mongoose');

var MemberSchema = new mongoose.Schema({
  member_id : String,
  nick_name: String,
  attendance: [Number],
  comments: String,
  topic:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
});

mongoose.model('Member', MemberSchema);

