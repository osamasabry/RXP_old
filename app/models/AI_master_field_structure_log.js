var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var RxP_AIMasterFieldStructureLogSchema = mongoose.Schema({
    
	AI_Master_Clinical_Data_Field_Structure_Log_Code     	  				 :Number,
    AI_Master_Clinical_Data_Field_Structure_Log_FieldName     	 			 :String,
    AI_Master_Clinical_Data_Field_Structure_Log_Field_Structure_DataType_ID  :Number,
    AI_Master_Clinical_Data_Field_Structure_Log_IsMandatory 				 :Number,
    AI_Master_Clinical_Data_Field_Structure_Log_CreatedBy_Employee_ID        :Number,
    AI_Master_Clinical_Data_Field_Structure_Log_CreatedDate					 :Date,
    AI_Master_Clinical_Data_Field_Structure_Log_IsActive					 :Number,
    AI_Master_Clinical_Data_Field_Structure_Log_Country_ID					 :Number,	
});


var Master_Fields_Log = module.exports = mongoose.model('RxP_AI_Master_Clinical_Data_Field_Structure_Log', RxP_AIMasterFieldStructureLogSchema);


module.exports.getLastCode = function(callback){
    
    Master_Fields_Log.findOne({},callback).sort({AI_Master_Clinical_Data_Field_Structure_Log_Code:-1});
}