var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_AITableSchema = mongoose.Schema({
    
	AI_Code     	  				 				:Number,
    AI_Name     	 				 				:String,
    AI_ATC_Code										:String,
    AI_Status 						 				:Number,
    AI_Pharmaceutical_Categories_ID  				:[Number],
    AI_CountryBasedAI_ID			 				:Number,
    AI_CountryBasedAI_AI_ID			 				:Number,
    AI_CountryBasedAI_Country_ID	 				:Number,
    AI_CountryBasedAI_Dosing						:[String],
    AI_CountryBasedAI_UsaageLabeledIndications  	:[String],
    AI_CountryBasedAI_UsaageOffLabeledIndications 	:[String],
    AI_CountryBasedAI_Administration				:[String],
    AI_CountryBasedAI_DietaryConsiderations			:String,
    AI_CountryBasedAI_PreparationForAdministration	:String,
    AI_CountryBasedAI_PregnancyConsideration		:String,
    AI_CountryBasedAI_Storage						:String,
    AI_CountryBasedAI_Stability						:String,

});


var AI_table = module.exports = mongoose.model('rxp_ai', rxp_AITableSchema);


module.exports.getLastCode = function(callback){
    
    AI_table.findOne({},callback).sort({AI_Code:-1});
}
