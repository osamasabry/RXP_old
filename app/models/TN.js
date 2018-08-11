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

    TN_AssiendToEditor_Employee_ID    :Number,
    TN_EditStatus                     :Number,
    TN_EditDate_Start                 :Date,
    TN_EditedBy_Employee_ID           :Number,
    TN_EditDate_Close                 :Date,
    
    TN_AssiendToReviewer_Employee_ID  :Number,
    TN_ReviewStatus                   :Number,
    TN_ReviewDate_Start               :Date,
    TN_ReviewedBy_Employee_ID         :Number,
    TN_ReviewDate_Close               :Date,
    
    TN_AssiendToGrammer_Employee_ID   :Number,
    TN_GrammerStatus                  :Number,
    TN_GrammerReview_Date_Start       :Date,
    TN_GrammerReviewBy_Employee_ID    :Number,
    TN_GrammerReview_Date_Close       :Date,
    
    TN_AssiendToPublisher_Employee_ID :Number,
    TN_PublishStatus                  :Number,
    TN_PublishDate_Start              :Date,
    TN_Publishedby_Employee_ID        :Number,
    TN_PublishDate_Close              :Date,
});


var TN_table = module.exports = mongoose.model('rxp_tn', rxp_TNTableSchema);


module.exports.getLastCode = function(callback){
    
    TN_table.findOne({},callback).sort({TN_Code:-1});
}