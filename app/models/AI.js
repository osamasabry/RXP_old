var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_AITableSchema = mongoose.Schema({
    
	AI_Code     	  				 :Number,
    AI_Name     	 				 :String,
    AI_ATC_Code  					 :String,
    AI_Status 						 :Number,
    AI_Pharmaceutical_Categories_ID  :[Number]
});


var AI_table = module.exports = mongoose.model('rxp_ai', rxp_AITableSchema);


module.exports.getLastCode = function(callback){
    
    AI_table.findOne({},callback).sort({AI_Code:-1});
}
