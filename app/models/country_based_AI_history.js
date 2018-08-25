var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_CountryBasedAIHistorySchema = mongoose.Schema({
    
    CountryBasedAIHistory_Code                             :Number,
	CountryBasedAIHistory_Dosing     	  				   :Object,
    CountryBasedAIHistory_UsaageLabeledIndications 	       :[String],
    CountryBasedAIHistory_UsaageOffLabeledIndications 	   :[String],
    CountryBasedAIHistory_Administration  				   :[String],
    CountryBasedAIHistory_DietaryConsiderations		       :String,
    CountryBasedAIHistory_PreparationForAdministration     :String,
    CountryBasedAIHistory_PregnancyConsideration		   :String,
    CountryBasedAIHistory_Storage			               :String,
    CountryBasedAIHistory_Stability					       :String,
    CountryBasedAIHistory_AI_Code                          :Number,
    CountryBasedAIHistory_Country_ID                       :Number,

    CountryBasedAIHistory_AssiendToEditor_Employee_ID    :Number,
    CountryBasedAIHistory_EditStatus                     :Number,
    CountryBasedAIHistory_EditDate_Start                 :Date,
    CountryBasedAIHistory_EditedBy_Employee_ID           :Number,
    CountryBasedAIHistory_EditDate_Close                 :Date,
    
    CountryBasedAIHistory_AssiendToReviewer_Employee_ID  :Number,
    CountryBasedAIHistory_ReviewStatus                   :Number,
    CountryBasedAIHistory_ReviewDate_Start               :Date,
    CountryBasedAIHistory_ReviewedBy_Employee_ID         :Number,
    CountryBasedAIHistory_ReviewDate_Close               :Date,
    
    CountryBasedAIHistory_AssiendToGrammer_Employee_ID   :Number,
    CountryBasedAIHistory_GrammerStatus                  :Number,
    CountryBasedAIHistory_GrammerReview_Date_Start       :Date,
    CountryBasedAIHistory_GrammerReviewBy_Employee_ID    :Number,
    CountryBasedAIHistory_GrammerReview_Date_Close       :Date,
    
    CountryBasedAIHistory_AssiendToPublisher_Employee_ID :Number,
    CountryBasedAIHistory_PublishStatus                  :Number,
    CountryBasedAIHistory_PublishDate_Start              :Date,
    CountryBasedAIHistory_Publishedby_Employee_ID        :Number,
    CountryBasedAIHistory_PublishDate_Close              :Date,
    
    CountryBasedAIHistory_RevisionCode                   :Number,
    
});


var CountryBasedAIHistory_table = module.exports = mongoose.model('rxp_country_based_ai_history', rxp_CountryBasedAIHistorySchema);


module.exports.getLastCode = function(callback){
    
    CountryBasedAIHistory_table.findOne({},callback).sort({CountryBasedAIHistory_Code:-1});
}