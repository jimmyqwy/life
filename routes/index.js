var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Mogo models
var mongoose = require('mongoose');
var TopicModel = mongoose.model('Topic');
var MemberModel = mongoose.model('Member');
var EntryModel = mongoose.model('Entry');

// router : preloading topics by id
// when we define a route URL with :topic in it, this function will be run first
router.param('topic', function(req, res, next, id) {
    var query = TopicModel.findById(id);
    query.exec( function (err,topic) {
        if (err)  {  return next(err);  }
        if (!topic)  {
            return next( new Error('Can not find party topic, please try again.')); 
        }

        req.topic = topic;
        return next();
    });
});

// router : preloading member by id
// when we define a route URL with :member in it, this function will be run first
router.param('memID', function(req, res, next, id) {
    var query = MemberModel.findById(id);
    query.exec( function (err,mem) {
        if (err)  {  return next(err);  }
        if (!mem)  {
            return next( new Error('Can not find members please try again.'));
        }
        req.member = mem;
        return next();
    });
});

// GET /topics/
// router: get topics
router.get('/topics', function(req, res, next) {
      TopicModel.find( function(err, topics)  {
        if (err)  {  return next(err);  }
        res.json(topics);
      });
});

// POST /topics/
// router: post Topics
router.post('/topics', function(req, res, next) {
    var topic = new TopicModel(req.body);
    topic.save(function(err, topic) {
        if (err)  {  return next(err);  }
        res.json(topic);
    });
});

// GET /topics/{topicID}
// router: get topic by id
router.get('/topics/:topic', function(req,res) {
    res.json(req.topic);
});

/*
// GET  /topics/{topicID}/user/{userID}
// INFORMATION of specific topic and specific userid
router.get('/topics/:topic/user/:memID', function(req, res, next) {
    res.json(req.topic.members[req.member]);
});
*/

// POST /topics/{topicID}/join/{memberID}
// join some specific topic (new member)
router.post('/topics/:topic/join/:memID', function(req, res, next) {
    // new entry
    var new_entry = new EntryModel();
    try {
        var  attendArray = req.body.attendance.slice(1,-1).split(',');
        for (var index in attendArray) {
            new_entry.attendance.push(attendArray[index]);
        }
        new_entry.comments = req.body.comments;
    } catch(e) {
        return next("Input Attendance attribute error!");
    }

    new_entry.topic = req.topic;

    new_entry.save(function(err, member) {
        if (err)    {   return next(err);   }
         var member = req.member;
         member.entries.push(new_entry);
         member.save(function(err, mem) {
            if (err)    {   return next(err);   }
            res.json(mem);
        });
    });
    

    /*
    if (req.body.nick_name)
        member.nick_name = req.body.nick_name;
    if (req.body.attendance) {
        member.attendance = [];
        try {
            var  attendArray = req.body.attendance.slice(1,-1).split(',');
            for (var index in attendArray) {
                member.attendance.push(attendArray[index]);
            }
        } catch(e) {
            return next("Input Attendance attribute error!");
        }
    }
    if (req.body.comments)
        member.comments = req.body.comments;
    

    member.entries.push(new_entry);

    member.save(function(err, member) {
        if (err)    {   return next(err);   }
        req.topic.members = [];
        req.topic.members.push(member);
        req.topic.save(function(err, post) {
            if (err)    {   return next(err);   }
            res.json(member);
        });
    });
    */
});

///////////////////////////
// Entries related API
///////////////////////////
// router : preloading entry by id
// when we define a route URL with :entryID in it, this function will be run first
router.param('entryID', function(req, res, next, id) {
    var query = EntryModel.findById(id);
    query.exec( function (err,entry) {
        if (err)  {  return next(err);  }
        if (!entry)  {
            return next( new Error('Can not find any entries please try again.'));
        }
        req.entry = entry;
        return next();
    });
});

// GET /entries/
router.get('/entries', function(req, res, next) {
    EntryModel.find( function(err, entries)  {
        if (err)  {  return next(err);  }
        res.json(entries);
      });
});

// GET /entries/{:entries}
router.get('/entries/:entryID', function(req, res, next) {
    res.json(req.entry);
});

// POST /entries/{:entries}
router.post('/entries/:entryID', function(req, res, next) {
    var query = EntryModel.findById(req.body._id);
    query.exec( function (err,entry) {
        if (err)  {  return next(err);  }
        if (!entry)  {
            return next( new Error('Can not find entries to update, please try again.'));
        }
        entry.attendance = req.body.attendance;
        entry.comments = req.body.comments;
        entry.save(function(err, entry) {
            if (err)    {   return next(err);   }
            res.json(entry);
        });
    });
});

module.exports = router;
