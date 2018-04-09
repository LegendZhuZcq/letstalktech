var mongoose = require('mongoose');
var Eve = mongoose.model('Event');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//Get the list of eventSchema
module.exports.eventListByTime = function(req,res){
  var now = new Date();
  Eve
    .find()
    //.where('time').gte(now)
    .exec(function(err, results, stats){
      var events;
      if (err) {
        console.log('something is wrong:', err);
        sendJSONresponse(res, 404, err);
      } else {
        events = buildEventList(req, res, results, stats);
        sendJSONresponse(res, 200, events);
      }
    });
};

var buildEventList = function(req, res, results, stats){
  var allEvents = [];
  console.log(results);
  // results.forEach(function(doc){
  //   console.log(doc.obj.club);
  //   allEvents.push({
  //     club:doc.obj.club,
  //     title:doc.obj.title,
  //     time:doc.obj.time,
  //     _id:doc.obj._id
  //   });
  // });
  return results;
};

module.exports.eventReadOne = function(req, res) {
  if(req.params &&  req.params.eventid){
    Eve
     .findById(req.params.eventid)
     .exec(function(err, result){
       if(!result){
         sendJSONresponse(res, 404, {"message":"event not found"});
         return;
       } else if (err) {
         console.log(err);
         sendJSONresponse(res, 4040, err);
         return;
       }
       sendJSONresponse(res, 200, result);
     });
  } else {
    sendJSONresponse(res, 404, {"message":"event id was not recieved"});
  }
};


module.exports.eventCreate = function(req, res){
  console.log(req.body.club, req.body.title);
  Eve.create({
    club:req.body.club,
    title:req.body.title,
    time:new Date(req.body.time)
  }, function(err, result){
    if(err){
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(result);
      sendJSONresponse(res, 201, result);
    }
  });
};

module.exports.eventUpdateOne = function(req,res){
  if(!req.params.eventid){
    sendJSONresponse(res, 404, {
      "message":"event id is not found"
    });
    return;
  }
  Eve
    .findById(req.params.eventid)
    .select('-comments')
    .exec(
      function(err, result){
        if (!result){
          sendJSONresponse(res, 404, {
            "message":"event not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        result.club = req.nody.club;
        result.title = req.body.title;
        result.time = req.body.time;
        result.save(function(err, result){
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, result);
          }
        });
      }
    );
};

module.exports.eventDeleteOne = function(req,res){
  var eventid = req.params.eventid;
  if (eventid) {
    Eve
      .findByIdAndRemove(eventid)
      .exec(
        function(err, result) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Event id " + eventid + " deleted");
          sendJSONresponse(res, 204, null);
        }
      );
  } else {
    sendJSONresponse(res, 404, {
      "message": "No event id was recieved"
    });
  }
};
