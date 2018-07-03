var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutUsageAgeSchema = mongoose.Schema({

	UsageAge_Code     	  :Number,
    UsageAge_Name    	  :String,
    UsageAge_Description  :String,
    UsageAge_IsActive     :Number,
    
});


var UsageAge = module.exports = mongoose.model('rxp_lut_usage_age', rxp_LutUsageAgeSchema);


module.exports.getLastCode = function(callback){
    
    UsageAge.findOne({},callback).sort({UsageAge_Code:-1});
}