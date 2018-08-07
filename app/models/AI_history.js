var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_AIHistorySchema = mongoose.Schema({
    
	AIHistory_Code     	  				 	:Number,
    AIHistory_Name     	 				 	:String,
    AIHistory_ATC_Code						:String,
    AIHistory_Status 						:Number,
    AIHistory_Pharmaceutical_Categories_ID  :[Number],
    AIHistory_FDAFeed			 			:String,
    AIHistory_EUFeed			 			:String,
    AIHistory_ClinicalPracticeGuidelines	:String,
    AIHistory_Contraindications				:String,
    AIHistory_Warnings_Precautions  		:String,
    AIHistory_AdverseReactionsConcerns 		:String,
    AIHistory_DiseaseRelatedConcerns		:String,
    AIHistory_DoseFormSpecificIssues		:String,
    AIHistory_Others						:String,
    AIHistory_GeriatricConsideration		:String,
    AIHistory_PregnancyConsideration		:String,
    AIHistory_revision                      :Number,

});


var AI_History = module.exports = mongoose.model('rxp_ai_history', rxp_AIHistorySchema);


module.exports.getLastCode = function(callback){
    
    AI_History.findOne({},callback).sort({AIHistory_Code:-1});
}