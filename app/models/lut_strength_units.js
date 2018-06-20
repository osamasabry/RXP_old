var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutStrengthUnitsSchema = mongoose.Schema({
    
	StrengthUnit_Code     	  :Number,
    StrengthUnit_Name     	  :String,
    StrengthUnit_Description  :String,
    StrengthUnit_IsActive     :Number,
    
});


StrengthUnit = module.exports = mongoose.model('rxp_lut_strength_unit', rxp_LutStrengthUnitsSchema);


module.exports.getLastCode = function(callback){
    
    StrengthUnit.findOne({},callback).sort({StrengthUnit_Code:-1});
}