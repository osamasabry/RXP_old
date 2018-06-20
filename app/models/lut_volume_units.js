var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutVolumeUnitSchema = mongoose.Schema({
    
	VolumeUnit_Code     	  :Number,
    VolumeUnit_Name     	  :String,
    VolumeUnit_Description    :String,
    VolumeUnit_IsActive       :Number,
    
});


VolumeUnit = module.exports = mongoose.model('rxp_lut_volume_unit', rxp_LutVolumeUnitSchema);


module.exports.getLastCode = function(callback){
    
    VolumeUnit.findOne({},callback).sort({VolumeUnit_Code:-1});
}