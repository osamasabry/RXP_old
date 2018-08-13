var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_TNTableSchema = mongoose.Schema({
    
	TN_Code     	  				 :Number,
    TN_Name     	 				 :String,
    TN_ActiveIngredients 			 :[Number],
    TN_Status 						 :Number,
    TN_Form_ID  					 :Number,
    TN_Route_ID						 :Number,
    TN_Strength_Unit_ID 			 :Number,
    TN_Strength_Value				 :String,
    TN_Weight_Unit_ID			     :Number,
    TN_Weight_Value					 :String,
    TN_Volume_Unit_ID				 :Number,
    TN_Volume_Value 				 :String,
    TN_Concentration_Unit_ID		 :Number,
    TN_Concentration_Value			 :String,
    TN_Country_ID					 :[Number],
});


var TN_table = module.exports = mongoose.model('rxp_tn', rxp_TNTableSchema);


module.exports.getLastCode = function(callback){
    
    TN_table.findOne({},callback).sort({TN_Code:-1});
}