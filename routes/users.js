var express = require('express');
var router = express.Router();

// Mogo models
var mongoose = require('mongoose');
var TopicModel = mongoose.model('Topic');
var MemberModel = mongoose.model('Member');

//>>> UNDER PATTERN /users/ <<<
// GET users/
/* GET users listing. */
router.get('/', function(req, res, next) {
      MemberModel.find( function(err, members)  {
        if (err)  {  return next(err);  }
        res.json(members);
      });
});

// POST users/ 
// Add a new member
router.post('/', function(req, res, next) {
    var member = new MemberModel(req.body);
    member.save( function(err, member) {
        if (err)  { return next(err);    }
        res.json(member);
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
        // console.log(mem);
        req.member = mem;
        return next();
    });
});

// GET users/{memberID}
// router: get topic by id
router.get('/:memID', function(req,res) {
    res.json(req.member);
});

// GET /users/{memberID}/entries
router.get('/:memID/entries', function(req, res, next) {
    req.member.populate('entries', function (err, entry) {
        if (err)  { return next(err);    }
        console.log(entry);
        res.json(entry);
    });
});

module.exports = router;
