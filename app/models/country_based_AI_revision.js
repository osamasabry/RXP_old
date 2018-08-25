var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_CountryBasedAIRevisionSchema = mongoose.Schema({
    
    CountryBasedAIRevision_Code                            :Number,
	CountryBasedAIRevision_Dosing     	  				   :Object,
    CountryBasedAIRevision_UsaageLabeledIndications 	   :[String],
    CountryBasedAIRevision_UsaageOffLabeledIndications 	   :[String],
    CountryBasedAIRevision_Administration  				   :[String],
    CountryBasedAIRevision_DietaryConsiderations		   :String,
    CountryBasedAIRevision_PreparationForAdministration    :String,
    CountryBasedAIRevision_PregnancyConsideration		   :String,
    CountryBasedAIRevision_Storage			               :String,
    CountryBasedAIRevision_Stability					   :String,
    CountryBasedAIRevision_AI_Code                         :Number,
    CountryBasedAIRevision_Country_ID                      :Number,
    CountryBasedAIRevision_CountryBasedAI_Code             :Number,

    CountryBasedAIRevision_AssiendToEditor_Employee_ID    :Number,
    CountryBasedAIRevision_EditStatus                     :Number,
    CountryBasedAIRevision_EditDate_Start                 :Date,
    CountryBasedAIRevision_EditedBy_Employee_ID           :Number,
    CountryBasedAIRevision_EditDate_Close                 :Date,
    
    CountryBasedAIRevision_AssiendToReviewer_Employee_ID  :Number,
    CountryBasedAIRevision_ReviewStatus                   :Number,
    CountryBasedAIRevision_ReviewDate_Start               :Date,
    CountryBasedAIRevision_ReviewedBy_Employee_ID         :Number,
    CountryBasedAIRevision_ReviewDate_Close               :Date,
    
    CountryBasedAIRevision_AssiendToGrammer_Employee_ID   :Number,
    CountryBasedAIRevision_GrammerStatus                  :Number,
    CountryBasedAIRevision_GrammerReview_Date_Start       :Date,
    CountryBasedAIRevision_GrammerReviewBy_Employee_ID    :Number,
    CountryBasedAIRevision_GrammerReview_Date_Close       :Date,
    
    CountryBasedAIRevision_AssiendToPublisher_Employee_ID :Number,
    CountryBasedAIRevision_PublishStatus                  :Number,
    CountryBasedAIRevision_PublishDate_Start              :Date,
    CountryBasedAIRevision_Publishedby_Employee_ID        :Number,
    CountryBasedAIRevision_PublishDate_Close              :Date,
    
    CountryBasedAIRevision_RevisionCode                   :Number,
    
});


var CountryBasedAIRevision_table = module.exports = mongoose.model('rxp_country_based_ai_revision', rxp_CountryBasedAIRevisionSchema);


module.exports.getLastCode = function(callback){
    
    CountryBasedAIRevision_table.findOne({},callback).sort({CountryBasedAIRevision_Code:-1});
}