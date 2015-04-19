var mongoose = require('mongoose');

var EntrySchema = new mongoose.Schema({
  attendance: [Number],
  comments: String,
  topic:  { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
});
mongoose.model('Entry', EntrySchema);

var MemberSchema = new mongoose.Schema({
  member_id : String,
  nick_name: String,
  entries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }]
});
mongoose.model('Member', MemberSchema);



