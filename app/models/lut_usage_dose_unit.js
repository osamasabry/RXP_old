var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutUsageDoseUnitSchema = mongoose.Schema({

	UsageDoseUnit_Code     	  :Number,
    UsageDoseUnit_Name    	  :String,
    UsageDoseUnit_Description :String,
    UsageDoseUnit_IsActive    :Number,
    
});


var UsageDose = module.exports = mongoose.model('rxp_lut_usage_dose_unit', rxp_LutUsageDoseUnitSchema);


module.exports.getLastCode = function(callback){
    
    UsageDose.findOne({},callback).sort({UsageDoseUnit_Code:-1});
}