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

// router: get topics
router.get('/topics', function(req, res, next) {
      TopicModel.find( function(err, topics)  {
        if (err)  {  return next(err);  }
        res.json(topics);
      });
});

// router: post Topics
router.post('/topics', function(req, res, next) {
    var topic = new TopicModel(req.body);
    topic.save(function(err, topic) {
        if (err)  {  return next(err);  }
        res.json(topic);
    });
});

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

// router: get topic by id
router.get('/topics/:topic', function(req,res) {
    res.json(req.topic);
});

module.exports = router;
