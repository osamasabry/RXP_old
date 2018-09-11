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
    
    AIHistory_AssiendToEditor_Employee_ID   :Number,
    AIHistory_EditStatus                    :Number,
    AIHistory_EditDate_Start                :Date,
    AIHistory_EditedBy_Employee_ID          :Number,
    AIHistory_EditDate_Close                :Date,
    
    AIHistory_AssiendToReviewer_Employee_ID :Number,
    AIHistory_ReviewStatus                  :Number,
    AIHistory_ReviewDate_Start              :Date,
    AIHistory_ReviewedBy_Employee_ID        :Number,
    AIHistory_ReviewDate_Close              :Date,
    
    AIHistory_AssiendToGrammer_Employee_ID  :Number,
    AIHistory_GrammerStatus                 :Number,
    AIHistory_GrammerReview_Date_Start      :Date,
    AIHistory_GrammerReviewBy_Employee_ID   :Number,
    AIHistory_GrammerReview_Date_Close      :Date,
    
    AIHistory_AssiendToPublisher_Employee_ID:Number,
    AIHistory_PublishStatus                 :Number,
    AIHistory_PublishDate_Start             :Date,
    AIHistory_Publishedby_Employee_ID       :Number,
    AIHistory_PublishDate_Close             :Date,
    AIHistory_VersionCode                   :Number,

});


var AI_History = module.exports = mongoose.model('rxp_ai_history', rxp_AIHistorySchema);


module.exports.getLastCode = function(callback){
    
    AI_History.findOne({},callback).sort({AIHistory_Code:-1});
}