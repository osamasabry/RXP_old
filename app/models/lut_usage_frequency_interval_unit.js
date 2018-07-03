var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutUsageFrequencyIntervalUnitSchema = mongoose.Schema({

	UsageFrequenIntervalUnit_Code     	  :Number,
    UsageFrequenIntervalUnit_Name    	  :String,
    UsageFrequenIntervalUnit_Description  :String,
    UsageFrequenIntervalUnit_IsActive     :Number,
    
});


var UsageFrequenInterval = module.exports = mongoose.model('rxp_lut_usage_frequency_interval_unit', rxp_LutUsageFrequencyIntervalUnitSchema);


module.exports.getLastCode = function(callback){
    
    UsageFrequenInterval.findOne({},callback).sort({UsageFrequenIntervalUnit_Code:-1});
}