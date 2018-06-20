var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutSizeUnitSchema = mongoose.Schema({
    
	SizeUnit_Code     	  :Number,
    SizeUnit_Name     	  : String,
    SizeUnit_Description    :String,
    SizeUnit_IsActive       :Number,
    
});


SizeUnit = module.exports = mongoose.model('rxp_lut_size_unit', rxp_LutSizeUnitSchema);


module.exports.getLastCode = function(callback){
    
    SizeUnit.findOne({},callback).sort({SizeUnit_Code:-1});
}