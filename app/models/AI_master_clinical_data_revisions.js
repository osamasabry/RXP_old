var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');



var rxp_AIMasterRevisionsSchema = mongoose.Schema({
    
	AIMasterRevision_Code     	  					:Number,
  	AIMasterRevision_Name     	 				 	:String,
    AIMasterRevision_ATC_Code						:String,
    AIMasterRevision_Status 						:Number,
    AIMasterRevision_Pharmaceutical_Categories_ID  	:[Number],
    AIMasterRevision_FDAFeed			 			:String,
    AIMasterRevision_EUFeed			 				:String,
    AIMasterRevision_ClinicalPracticeGuidelines	 	:String,
    AIMasterRevision_Contraindications				:String,
    AIMasterRevision_Warnings_Precautions  			:String,
    AIMasterRevision_AdverseReactionsConcerns 		:String,
    AIMasterRevision_DiseaseRelatedConcerns			:String,
    AIMasterRevision_DoseFormSpecificIssues			:String,
    AIMasterRevision_Others							:String,
    AIMasterRevision_GeriatricConsideration			:String,
    AIMasterRevision_PregnancyConsideration			:String,
    AIMasterRevision_AI_ID 							:Number
});


var AIMasterRevisions  = module.exports = mongoose.model('rxp_AI_master_clinical_data_revision', rxp_AIMasterRevisionsSchema);

module.exports.getLastCode = function(callback){
    
    AIMasterRevisions.findOne({},callback).sort({AIMasterRevision_Code:-1});
}