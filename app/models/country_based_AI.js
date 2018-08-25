var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_CountryBasedAISchema = mongoose.Schema({
    
    CountryBasedAI_Code                            :Number,
	CountryBasedAI_Dosing     	  				   :Object,
    CountryBasedAI_UsaageLabeledIndications 	   :[String],
    CountryBasedAI_UsaageOffLabeledIndications 	   :[String],
    CountryBasedAI_Administration  				   :[String],
    CountryBasedAI_DietaryConsiderations		   :String,
    CountryBasedAI_PreparationForAdministration    :String,
    CountryBasedAI_PregnancyConsideration		   :String,
    CountryBasedAI_Storage			               :String,
    CountryBasedAI_Stability					   :String,
    CountryBasedAI_AI_Code                         :Number,
    CountryBasedAI_Country_ID                      :Number,
    
});


var CountryBasedAI_table = module.exports = mongoose.model('rxp_country_based_ai', rxp_CountryBasedAISchema);


module.exports.getLastCode = function(callback){
    
    CountryBasedAI_table.findOne({},callback).sort({CountryBasedAI_Code:-1});
}