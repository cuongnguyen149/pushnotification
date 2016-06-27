var gcm = require('node-gcm');
var apn = require('apn');
var DeviceId = require('../models/deviceId').DeviceId;
// Create a message 
// ... with default values 
var sender = new gcm.Sender('AIzaSyAuDFgrilbjQVgVwCx33Jo47TR4EyHAN1c');
var message = new gcm.Message();
//add message data.
message.addData('mess1', 'test notification from server');
message.delayWhileIdle = true;
// AIzaSyACNJznLFZWw5JNqH-D_K8WXIxE5J1hLc0
 
// Set up the sender with you API key 
// Add the registration IDs of the devices you want to send to 
module.exports = function(app){
//Push notification for android devices
  app.post('/api/push', function(req, res){
    var deviceId = req.body.deviceId,
        token = "ezZjO4hYlO4:APA91bG0V5QAoQPWJCC01aT3sBW9wHwJpPLLMKAePjPkz9dHr7z2cT14om4hVe1fNsiiz_dGbpM0Mey0rzKZVwuiM0d-VQDbRrHDIL8j2xgOSNc8511JxA0qcNU9LI7VIZ7ju3L_S8pU",
        registrationIds = [];
        registrationIds.push(deviceId);
    sender.send(message, registrationIds, 4,function(err, result) {
      if(err){
        console.error(err);
        res.json(200, err);
      }else{
        console.log(result);
        res.json(200, result);  
      }
    });
  });
//end Push notification for android devices

// start store register device id
  app.post('/api/regid', function(req, res){
    var deviceId = req.body.deviceId,
        os = req.body.os,
        userName = req.body.userName;
    DeviceId.find({userName : userName , deviceId : deviceId}, function(err, ids) {
      if(!err) {
          if (ids && ids.length > 0) {
            res.status(201).json({message : "DeviceID have exist : " + userName}); 
          }else{
           DeviceId.collection.insert({userName : userName, deviceId : deviceId, platform: os},{}, 
            function(err, returnIds){
            if(err) {
              res.json(500, {message: "Could not insert new deviceId. Error: " + err});
            }
            res.status(201).json({message : "DeviceID inserted : " + deviceId}); 
          });
          }
      } else {
          res.json(500, { message: err });
      }
    }); 
  });
  //end store register device id

//Push notification for iOS devices
  app.post('/api/pushios', function(req, res){
    var token = req.body.token,
        os = req.body.os,
        userName = req.body.userName;

    var options = {
    cert: 'cer.pem',                 
    key:  'key.pem',                 
    passphrase: '1234',                 
    port: 2195,                       
    enhanced: true,                   
    cacheLength: 100, 
    batchFeedback: true,
    interval: 300
  };
    var apnConnection = new apn.Connection(options);
    var myDevice = new apn.Device('e3466de2cfce022c307bfeb327ec4f6ee1ced35eb65bbbda6461b094db2000e1');

    var note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600;// Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = {'messageFrom': 'Caroline'};
     var feedback = new apn.Feedback(options);
        feedback.on("feedback", function(devices) {
        devices.forEach(function(item) {
        // Do something with item.device and item.time;
          res.status(201).json({message : "Device: " + item.device + "Time:" + item.time}); 
        });
      });   
    apnConnection.pushNotification(note, myDevice);
  });
//end Push notification for iOS devices
};














