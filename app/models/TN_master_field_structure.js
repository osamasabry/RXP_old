var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var RxP_TNMasterFieldStructureSchema = mongoose.Schema({
    
	TN_Master_Clinical_Data_Field_Structure_Code     	  				 :Number,
    TN_Master_Clinical_Data_Field_Structure_FieldName     	 			 :String,
    TN_Master_Clinical_Data_Field_Structure_Field_Structure_DataType_ID  :Number,
    TN_Master_Clinical_Data_Field_Structure_IsMandatory 				 :Number,
    TN_Master_Clinical_Data_Field_Structure_IsActive					 :Number,
    TN_Master_Clinical_Data_Field_Structure_Country_ID                   :Number,
    TN_Master_Clinical_Data_Field_Structure_ISEditable                   :String, 
    TN_Master_Clinical_Data_Field_Structure_Priority					 :Number,
});


var TN_Master_Fields = module.exports = mongoose.model('RxP_TN_Master_Clinical_Data_Field_Structure', RxP_TNMasterFieldStructureSchema);


module.exports.getLastCode = function(callback){
    
    TN_Master_Fields.findOne({},callback).sort({TN_Master_Clinical_Data_Field_Structure_Code:-1});
}