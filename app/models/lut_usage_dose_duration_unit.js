var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutUsageDoseDurationUnitSchema = mongoose.Schema({

	UsageDoseDurationUnit_Code     	  :Number,
    UsageDoseDurationUnit_Name    	  :String,
    UsageDoseDurationUnit_Description :String,
    UsageDoseDurationUnit_IsActive    :Number,
    
});


var UsageDoseDuration = module.exports = mongoose.model('rxp_lut_usage_dose_duration_unit', rxp_LutUsageDoseDurationUnitSchema);


module.exports.getLastCode = function(callback){
    
    UsageDoseDuration.findOne({},callback).sort({UsageDoseDurationUnit_Code:-1});
}