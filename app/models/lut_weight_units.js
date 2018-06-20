var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutWeightUnitSchema = mongoose.Schema({
    
	WeightUnit_Code     	  :Number,
    WeightUnit_Name     	  : String,
    WeightUnit_Description    :String,
    WeightUnit_IsActive       :Number,
    
});


WeightUnit = module.exports = mongoose.model('rxp_lut_weight_unit', rxp_LutWeightUnitSchema);


module.exports.getLastCode = function(callback){
    
    WeightUnit.findOne({},callback).sort({WeightUnit_Code:-1});
}