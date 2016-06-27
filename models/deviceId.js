var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var deviceIdSchema = new Schema({
    deviceId        : { type: String },  
    userName        : { type: String },
    platform  		: { type: String }
 

});
// disable autoIndex since index creation can cause a significant performance impact.
deviceIdSchema.set('autoIndex', false);
// define index
deviceIdSchema.index({ username: 1 });


// create model
var deviceId = mongoose.model('deviceId', deviceIdSchema);

module.exports = {
  DeviceId: deviceId
};