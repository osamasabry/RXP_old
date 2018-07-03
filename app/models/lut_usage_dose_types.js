var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutUsageDoseTypesSchema = mongoose.Schema({

	UsageDoseType_Code     	  :Number,
    UsageDoseType_Name    	  :String,
    UsageDoseType_Description :String,
    UsageDoseType_IsActive    :Number,
    
});


var UsageDoseTypes = module.exports = mongoose.model('rxp_lut_usage_dose_type', rxp_LutUsageDoseTypesSchema);


module.exports.getLastCode = function(callback){
    
    UsageDoseTypes.findOne({},callback).sort({UsageDoseType_Code:-1});
}