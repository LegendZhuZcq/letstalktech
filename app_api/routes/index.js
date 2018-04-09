var express = require('express');
var router = express.Router();
var ctrlEvents = require('../controllers/events');
var ctrlComments = require('../controllers/comments');

//event

router.get('/events', ctrlEvents.eventListByTime);
router.post('/events', ctrlEvents.eventCreate);
router.get('/events/:eventid', ctrlEvents.eventReadOne);
router.put('/events/:eventid', ctrlEvents.eventUpdateOne);
router.delete('/events/:eventid', ctrlEvents.eventDeleteOne);

//comments

router.post('/events/:eventid/comments', ctrlComments.commentCreate);
router.put('/events/:eventid/:commentid', ctrlComments.commentAddVote);
router.delete('/events/:eventid/:commentid', ctrlComments.commentDeleteOne);

module.exports = router;
