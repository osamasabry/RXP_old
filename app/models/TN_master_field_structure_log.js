var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var RxP_TNMasterFieldStructureLogSchema = mongoose.Schema({
    
	TN_Master_Clinical_Data_Field_Structure_Log_Code     	  				 :Number,
    TN_Master_Clinical_Data_Field_Structure_Log_FieldName     	 			 :String,
    TN_Master_Clinical_Data_Field_Structure_Log_Field_Structure_DataType_ID  :Number,
    TN_Master_Clinical_Data_Field_Structure_Log_IsMandatory 				 :Number,
    TN_Master_Clinical_Data_Field_Structure_Log_CreatedBy_Employee_ID        :Number,
    TN_Master_Clinical_Data_Field_Structure_Log_CreatedDate					 :Date,
    TN_Master_Clinical_Data_Field_Structure_Log_IsActive					 :Number,
    TN_Master_Clinical_Data_Field_Structure_Log_Country_ID                   :Number,
});


var TN_Master_Fields_Log = module.exports = mongoose.model('RxP_TN_Master_Clinical_Data_Field_Structure_Log', RxP_TNMasterFieldStructureLogSchema);


module.exports.getLastCode = function(callback){
    
    TN_Master_Fields_Log.findOne({},callback).sort({TN_Master_Clinical_Data_Field_Structure_Log_Code:-1});
}