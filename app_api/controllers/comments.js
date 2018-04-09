var mongoose = require('mongoose');
var Eve = mongoose.model('Event');

var sendJSONresponse = function(res,status,content){
  res.status(status);
  res.json(content);
};

// Post a new comments under the event id
// /api/events/:eventid/comments

module.exports.commentCreate = function(req, res){
  if(req.params.eventid){
    Eve
      .findById(req.params.eventid)
      .select('comments')
      .exec(
        function(err, result){
          if (err) {
            sendJSONresponse(res, 400, err);
          } else {
            doAddComment(req,res,result);
          }
        }
      );
  } else {
    sendJSONresponse(res, 404, {"message":"event id is missing"});
  }
};

var doAddComment = function(req, res, selectedEvent){
   if(!selectedEvent){
     sendJSONresponse(res, 404, 'event is not found');
   } else {
     selectedEvent.comments.push({
       author:req.body.author,
       content:req.body.content
     });
     console.log(selectedEvent.id);
     selectedEvent.save(function(err, result) {
       var thisComment;
       if (err) {
         sendJSONresponse(res, 400, err);
       } else {
         thisComment = result.comments[result.comments.length - 1 ];
         sendJSONresponse(res, 201, thisComment);
       }
     });
   }
};

module.exports.commentAddVote = function(req,res){
  if(!req.params.eventid || !req.params.commentid){
    sendJSONresponse(res, 404, {
      "message":"event or review is not selected"
    });
    return;
  }
  Eve
    .findById(req.params.eventid)
    .select('comments')
    .exec(
      function(err, selectedEvent){
          var thisComment;
          if (!selectedEvent){
            sendJSONresponse(res, 404, {"message":"event id is not recieved"});
            return;
          } else if (err){
            sendJSONresponse(res, 400, err);
            return;
          }
          if (selectedEvent.comments && selectedEvent.comments.length>0){
              thisComment = selectedEvent.comments.id(req.params.commentid);
              if(!thisComment){
                sendJSONresponse(res, 404, {"message":"comment not found"});
              } else {
                thisComment.votes +=1;
                selectedEvent.save(function(err, location){
                  if(err){
                    sendJSONresponse(res,404, err);
                  } else {
                    sendJSONresponse(res, 200, thisComment);
                  }
                });
              }
            } else {
              sendJSONresponse(res, 404, {"message":"the event has no comment"});
            }
      });
  };

module.exports.commentDeleteOne = function(req, res){
  if(!req.params.eventid || !req.params.commentid){
    sendJSONresponse(res, 404, {
      "message":"event or review is not selected"
    });
    return;
  }
  Eve
    .findById(req.params.eventid)
    .select('comments')
    .exec(
      function(err, selectedEvent){
          if (!selectedEvent){
            sendJSONresponse(res, 404, {"message":"event id is not recieved"});
            return;
          } else if (err){
            sendJSONresponse(res, 400, err);
            return;
          }
          if (selectedEvent.comments && selectedEvent.comments.length>0){
              console.log(selectedEvent.comments.id(req.params.commentid));
              if(!selectedEvent.comments.id(req.params.commentid)){
                sendJSONresponse(res, 404, {"message":"comment not found"});
              } else {
                console.log(selectedEvent.comments.id(req.params.commentid));
                selectedEvent.comments.id(req.params.commentid).remove();
                selectedEvent.save(function(err){
                  if(err){
                    sendJSONresponse(res,404, err);
                  } else {
                    sendJSONresponse(res, 204, {"message":"comment has been deleted"});
                  }
                });
              }
            } else {
              sendJSONresponse(res, 404, {"message":"the event has no comment"});
            }
      });
};
