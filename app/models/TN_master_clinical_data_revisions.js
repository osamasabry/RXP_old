var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_TNRevisionTableSchema = mongoose.Schema({
    
    TNRevision_Code                           :Number,
    TNRevision_Name                           :String,
    TNRevision_ActiveIngredients              :[Number],
    TNRevision_Status                         :Number,
    TNRevision_Form_ID                        :Number,
    TNRevision_Route_ID                       :Number,
    TNRevision_Strength_Unit_ID               :Number,
    TNRevision_Strength_Value                 :String,
    TNRevision_Weight_Unit_ID                 :Number,
    TNRevision_Weight_Value                   :String,
    TNRevision_Volume_Unit_ID                 :Number,
    TNRevision_Volume_Value                   :String,
    TNRevision_Concentration_Unit_ID          :Number,
    TNRevision_Concentration_Value            :String,
    TNRevision_Country_ID                     :[Number],

    TNRevision_AssiendToEditor_Employee_ID    :Number,
    TNRevision_EditStatus                     :Number,
    TNRevision_EditDate_Start                 :Date,
    TNRevision_EditedBy_Employee_ID           :Number,
    TNRevision_EditDate_Close                 :Date,
    
    TNRevision_AssiendToReviewer_Employee_ID  :Number,
    TNRevision_ReviewStatus                   :Number,
    TNRevision_ReviewDate_Start               :Date,
    TNRevision_ReviewedBy_Employee_ID         :Number,
    TNRevision_ReviewDate_Close               :Date,
    
    TNRevision_AssiendToGrammer_Employee_ID   :Number,
    TNRevision_GrammerStatus                  :Number,
    TNRevision_GrammerReview_Date_Start       :Date,
    TNRevision_GrammerReviewBy_Employee_ID    :Number,
    TNRevision_GrammerReview_Date_Close       :Date,
    
    TNRevision_AssiendToPublisher_Employee_ID :Number,
    TNRevision_PublishStatus                  :Number,
    TNRevision_PublishDate_Start              :Date,
    TNRevision_Publishedby_Employee_ID        :Number,
    TNRevision_PublishDate_Close              :Date,
    TNRevision_RevisionCode                   :Number,

});



var TNRevison_table = module.exports = mongoose.model('rxp_tn_revision', rxp_TNRevisionTableSchema);


module.exports.getLastCode = function(callback){
    
    TNRevison_table.findOne({},callback).sort({TNRevision_Code:-1});
}