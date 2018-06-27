var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutConcentrationSchema = mongoose.Schema({
    
	ConcentrationUnit_Code     	  :Number,
    ConcentrationUnit_Name     	  :String,
    ConcentrationUnit_Description  :String,
    ConcentrationUnit_IsActive     :Number,
    
});


var Concentration = module.exports = mongoose.model('rxp_lut_concentration', rxp_LutConcentrationSchema);


module.exports.getLastCode = function(callback){
    
    Concentration.findOne({},callback).sort({ConcentrationUnit_Code:-1});
}