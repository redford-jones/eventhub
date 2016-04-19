var express = require('express');
var router = express.Router();
var config = require('../bin/config');
var $ = require('jquery');
var moment = require('moment');

if (config.db.type == 'couch'){
  var nano = require('nano')('http://'+config.db.ip+':'+config.db.port);
  var db = nano.use(config.db.name);
}

/* GET all events page. */
router.get('/view/all', function(req, res, next) {
  db.view('events','list_view', function(err,body){
    if(!err){
      res.render('./event/index', {
        layout: {
          'title':'All events',
          'descriptionH1':body.total_rows+' event(s) found.',
          'descriptionDoc':'Click an event icon to view further information and book.'
        },
        eventList: body.rows,
        scripts:[]
       // scripts:['/js/init.js','https://maps.googleapis.com/maps/api/js?file=api&v='+config.gmaps.version]
      },function(err, html){
          res.status(500);
          next(err);
      });
    }
    else{
      var err = new Error('Database error');
      err.status = 500;
        res.status(500);
      next(err);
    }
  });
});

//GET individual event page.
router.get('/view/:id', function(req, res, next) {
  var eventID = req.params.id;
    db.view('events','by_id',{'key':eventID,'include_docs':true}, function(err,body){
        if(!err){
          var dbResponse = body.rows[0].doc;
            res.render('./event/individual', {
                layout:{
                    'title':dbResponse.title,
                    'descriptionH1':body.total_rows+' event(s) found.',
                    'descriptionDoc':'Click an event icon to view further information and book.'
                },
                events:body.rows,
                scripts:[
                    '/js/init.js'
                ]
            });
        }
        else{
            var err = new Error('Cannot connect to database');
            err.status = 500;
            next(err);
        }
    });
});

/* GET event create page. */
router.get('/create', function(req, res, next) {
  db.view('layouts','by_route',{'key':'/event/create', 'include_docs':true},function(err,body){
    if(!err){
      var dbResponse = body.rows[0].doc;
      res.render('./event/create', {
        'layout':{
          'title': dbResponse.pageTitle,
          'descriptionH1': dbResponse.pageDescription.h1,
          'descriptionDoc': dbResponse.pageDescription.doc
        },
        'scripts':[
            '/js/picker.time.js',
            'https://maps.googleapis.com/maps/api/js?file=api&v='+config.gmaps.version,
            '/js/gmaps.js',
            '/js/initMaps.js'
        ]
      });
    }
    else{
      var err = new Error('Database error');
      err.status = 500;
      next(err);
    }
  });
});

/* POST on create page. */
router.post('/create', function(req, res, next) {
  var formBody = req.body;
  var boolRestricted;
    if (formBody.eventRestricted){
      boolRestricted = true;
    } else{
      boolRestricted = false;
    }
  var now = new Date();
  var eventCreate = {
    '$type':'event',
    'title': formBody.eventName,
    'startDate': formBody.startDate,
    'startTime': formBody.startTime,
    'endDate': formBody.endDate,
    'endTime': formBody.endTime,
    'description':formBody.eventDescription,
    'location':{
      'building': formBody.eventBuilding,
      'room': formBody.eventRoom,
      'postalCode': formBody.eventLocation,
      'lat':formBody.eventLat,
      'lng':formBody.eventLng,
      'locality':formBody.eventGeoloc
    },
    'restricted': boolRestricted,
    'maxAttendees':formBody.eventAttendees,
    'organiserEmail': formBody.organiserEmail,
    'createdDate': now
  };
  if (eventCreate){
    db.insert(eventCreate,function(dbError,dbBody, dbHeaders){
      if(!dbError){
        console.log('Event created: '+dbBody);
        Materialize.toast('Creating event. Please wait...');
        //Implement POST/REDIRECT/GET pattern to prevent duplicate submission
        res.redirect(302,'/event/create/success?id='+dbBody.id);
      }
      else{
        var err = new Error('Cannot save event');
        err.status = dbError['status-code'];
        err.message = dbError.message;
        next(err);
      }
    });
  }
});

router.get('/create/success', function(req, res, next) {
  var eventID = req.query.id;
  db.view('events','by_id',{'key':eventID, 'include_docs':true},function(err,body){
    if(!err){
      var dbResponse = body.rows[0].doc;
      res.render('./event/success',{
        'layout':{
          'title': 'Event created',
          'descriptionH1': 'Click here for more information'
        },
        'eventID': eventID,
        'eventDetails':dbResponse,
        'scripts':[]
      });
    }
    else{
      var err = new Error('Database error');
      err.status = 500;
      next(err);
    }
  });
});

module.exports = router;