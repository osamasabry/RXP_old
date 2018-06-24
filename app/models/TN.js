var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_TNTableSchema = mongoose.Schema({
    
	TN_Code     	  				 :Number,
    TN_Name     	 				 :String,
    TN_ATC_Code  					 :String,
    TN_Status 						 :Number,
    TN_Pharmaceutical_Categories_ID  :String
});


var TN_table = module.exports = mongoose.model('rxp_tn', rxp_TNTableSchema);


module.exports.getLastCode = function(callback){
    
    TN_table.findOne({},callback).sort({TN_Code:-1});
}