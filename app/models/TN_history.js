var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_TNHistoryTableSchema = mongoose.Schema({
    
    TNHistory_Code                           :Number,
    TNHistory_Name                           :String,
    TNHistory_ActiveIngredients              :[Number],
    TNHistory_Status                         :Number,
    TNHistory_Form_ID                        :Number,
    TNHistory_Route_ID                       :Number,
    TNHistory_Strength_Unit_ID               :Number,
    TNHistory_Strength_Value                 :String,
    TNHistory_Weight_Unit_ID                 :Number,
    TNHistory_Weight_Value                   :String,
    TNHistory_Volume_Unit_ID                 :Number,
    TNHistory_Volume_Value                   :String,
    TNHistory_Concentration_Unit_ID          :Number,
    TNHistory_Concentration_Value            :String,
    TNHistory_Country_ID                     :[Number],

    TNHistory_AssiendToEditor_Employee_ID    :Number,
    TNHistory_EditStatus                     :Number,
    TNHistory_EditDate_Start                 :Date,
    TNHistory_EditedBy_Employee_ID           :Number,
    TNHistory_EditDate_Close                 :Date,
    
    TNHistory_AssiendToReviewer_Employee_ID  :Number,
    TNHistory_ReviewStatus                   :Number,
    TNHistory_ReviewDate_Start               :Date,
    TNHistory_ReviewedBy_Employee_ID         :Number,
    TNHistory_ReviewDate_Close               :Date,
    
    TNHistory_AssiendToGrammer_Employee_ID   :Number,
    TNHistory_GrammerStatus                  :Number,
    TNHistory_GrammerReview_Date_Start       :Date,
    TNHistory_GrammerReviewBy_Employee_ID    :Number,
    TNHistory_GrammerReview_Date_Close       :Date,
    
    TNHistory_AssiendToPublisher_Employee_ID :Number,
    TNHistory_PublishStatus                  :Number,
    TNHistory_PublishDate_Start              :Date,
    TNHistory_Publishedby_Employee_ID        :Number,
    TNHistory_PublishDate_Close              :Date,
    TNHistory_RevisionCode                   :Number,

});



var TNHistory_table = module.exports = mongoose.model('rxp_tn_history', rxp_TNHistoryTableSchema);


module.exports.getLastCode = function(callback){
    
    TNHistory_table.findOne({},callback).sort({TNHistory_Code:-1});
}