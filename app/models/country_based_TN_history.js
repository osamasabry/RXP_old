var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_CountryBasedTNHistorySchema = mongoose.Schema({
    
    CountryBasedTNHistory_Code                             :Number,
	CountryBasedTNHistory_Price     	  				   :Object,
    CountryBasedTNHistory_Images	                           :[String],
    
    CountryBasedTNHistory_TN_Code                          :Number,
    CountryBasedTNHistory_Country_ID                       :Number,
    CountryBasedTNHistory_CountryBasedTN_Code              :Number,


    CountryBasedTNHistory_AssiendToEditor_Employee_ID    :Number,
    CountryBasedTNHistory_EditStatus                     :Number,
    CountryBasedTNHistory_EditDate_Start                 :Date,
    CountryBasedTNHistory_EditedBy_Employee_ID           :Number,
    CountryBasedTNHistory_EditDate_Close                 :Date,
    
    CountryBasedTNHistory_AssiendToReviewer_Employee_ID  :Number,
    CountryBasedTNHistory_ReviewStatus                   :Number,
    CountryBasedTNHistory_ReviewDate_Start               :Date,
    CountryBasedTNHistory_ReviewedBy_Employee_ID         :Number,
    CountryBasedTNHistory_ReviewDate_Close               :Date,
    
    
    CountryBasedTNHistory_AssiendToPublisher_Employee_ID :Number,
    CountryBasedTNHistory_PublishStatus                  :Number,
    CountryBasedTNHistory_PublishDate_Start              :Date,
    CountryBasedTNHistory_Publishedby_Employee_ID        :Number,
    CountryBasedTNHistory_PublishDate_Close              :Date,
    
    CountryBasedTNHistory_RevisionCode                   :Number,
    
});


var CountryBasedTNHistory_table = module.exports = mongoose.model('rxp_country_based_tn_history', rxp_CountryBasedTNHistorySchema);


module.exports.getLastCode = function(callback){
    
    CountryBasedTNHistory_table.findOne({},callback).sort({CountryBasedTNHistory_Code:-1});
}