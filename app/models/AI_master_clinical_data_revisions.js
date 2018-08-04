var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');



var rxp_AIMasterRevisionsSchema = mongoose.Schema({
    
	AIMasterRevision_Code     	  				 					:Number,
    AIMasterRevision_Name     	 				 					:String,
    AIMasterRevision_ATC_Code										:String,
    AIMasterRevision_Status 						 				:Number,
    AIMasterRevision_Pharmaceutical_Categories_ID  					:[Number],
    AIMasterRevision_CountryBasedAI_ID			 					:Number,
    AIMasterRevision_CountryBasedAI_AI_ID			 				:Number,
    AIMasterRevision_CountryBasedAI_Country_ID	 					:Number,
    AIMasterRevision_CountryBasedAI_Dosing							:[String],
    AIMasterRevision_CountryBasedAI_UsaageLabeledIndications  		:[String],
    AIMasterRevision_CountryBasedAI_UsaageOffLabeledIndications 	:[String],
    AIMasterRevision_CountryBasedAI_Administration					:[String],
    AIMasterRevision_CountryBasedAI_DietaryConsiderations			:String,
    AIMasterRevision_CountryBasedAI_PreparationForAdministration	:String,
    AIMasterRevision_CountryBasedAI_PregnancyConsideration			:String,
    AIMasterRevision_CountryBasedAI_Storage							:String,
    AIMasterRevision_CountryBasedAI_Stability						:String,
    AIMasterRevision_AI_ID 											:Number,
});


var AIMasterRevisions  = module.exports = mongoose.model('rxp_AI_master_clinical_data_revision', rxp_AIMasterRevisionsSchema);

module.exports.getLastCode = function(callback){
    
    AIMasterRevisions.findOne({},callback).sort({AIMasterRevisions_Code:-1});
}