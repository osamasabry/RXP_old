var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutRouteSchema = mongoose.Schema({
    
	Route_Code     	  :Number,
    Route_Name     	  : String,
    Route_Description  :String,
    Route_IsActive     :Number,
    
});


var Route = module.exports = mongoose.model('rxp_lut_route', rxp_LutRouteSchema);


module.exports.getLastCode = function(callback){
    
    Route.findOne({},callback).sort({Route_Code:-1});
}