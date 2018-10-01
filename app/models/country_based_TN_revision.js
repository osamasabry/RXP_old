var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_CountryBasedTNRevisionSchema = mongoose.Schema({
    
    CountryBasedTNRevision_Code                            :Number,
    CountryBasedTNRevision_Price			               :String,
    CountryBasedTNRevision_Images					       :[String],
    CountryBasedTNRevision_TN_Code                         :Number,
    CountryBasedTNRevision_Country_ID                      :Number,
    CountryBasedTNRevision_CountryBasedTN_Code             :Number,

    CountryBasedTNRevision_AssiendToEditor_Employee_ID    :Number,
    CountryBasedTNRevision_EditStatus                     :Number,
    CountryBasedTNRevision_EditDate_Start                 :Date,
    CountryBasedTNRevision_EditedBy_Employee_ID           :Number,
    CountryBasedTNRevision_EditDate_Close                 :Date,
    
    CountryBasedTNRevision_AssiendToReviewer_Employee_ID  :Number,
    CountryBasedTNRevision_ReviewStatus                   :Number,
    CountryBasedTNRevision_ReviewDate_Start               :Date,
    CountryBasedTNRevision_ReviewedBy_Employee_ID         :Number,
    CountryBasedTNRevision_ReviewDate_Close               :Date,
    
   
    CountryBasedTNRevision_AssiendToPublisher_Employee_ID :Number,
    CountryBasedTNRevision_PublishStatus                  :Number,
    CountryBasedTNRevision_PublishDate_Start              :Date,
    CountryBasedTNRevision_Publishedby_Employee_ID        :Number,
    CountryBasedTNRevision_PublishDate_Close              :Date,
    
    CountryBasedTNRevision_RevisionCode                   :Number,
    
});


var CountryBasedTNRevision_table = module.exports = mongoose.model('rxp_country_based_tn_revision', rxp_CountryBasedTNRevisionSchema);


module.exports.getLastCode = function(callback){
    
    CountryBasedTNRevision_table.findOne({},callback).sort({CountryBasedTNRevision_Code:-1});
}